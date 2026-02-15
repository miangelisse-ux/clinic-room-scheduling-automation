// =======================================
// Google Workspace Room Scheduling Template
// Generalized & GitHub-Ready Version
// =======================================

// ---------- CONFIGURATION ----------
const ADMIN_EMAIL = "admin@example.com"; // Change to your admin email
const BUFFER_MINUTES = 10;               // Buffer time around bookings (minutes)

const calendarMap = {                    // Replace with your Google Calendar IDs
  "Room A": "calendar_id_1@example.com",
  "Room B": "calendar_id_2@example.com",
  "Room C": "calendar_id_3@example.com",
  "Play Room": "calendar_id_4@example.com",
  "Room D": "calendar_id_5@example.com"
};

const therapistEmailMap = {};            // Optional mapping: lowercase name → email
// -----------------------------------


// ---------- FORM SUBMISSION HANDLER ----------
function onFormSubmit(e) {
  if (!e || !e.namedValues) return;

  const lock = LockService.getScriptLock();
  lock.waitLock(30000);

  try {
    const r = e.namedValues;

    const norm = (s) => (s || "").toString().replace(/\u00A0/g, " ").replace(/\s+/g, " ").trim();
    const pick = (label) => {
      const target = label.toLowerCase();
      const keys = Object.keys(r || {}).map(k => ({ raw: k, k: norm(k).toLowerCase() }));
      const exact = keys.find(x => x.k === target);
      if (exact) return norm(r[exact.raw]?.[0]);
      const partial = keys.find(x => x.k.includes(target));
      if (partial) return norm(r[partial.raw]?.[0]);
      return "";
    };

    const parseTime = (t) => {
      t = norm(t);
      if (/^\d{1,2}:\d{2}$/.test(t)) {
        const [h, m] = t.split(":").map(Number);
        return { h, m };
      }
      const m = t.match(/^(\d{1,2}):(\d{2})(?::(\d{2}))?\s*(AM|PM)$/i);
      if (!m) throw new Error("Unrecognized time format: " + t);
      let h = +m[1], min = +m[2], ap = m[4].toUpperCase();
      if (ap === "PM" && h !== 12) h += 12;
      if (ap === "AM" && h === 12) h = 0;
      return { h, m: min };
    };

    const getCalOrThrow = (roomName) => {
      const cal = CalendarApp.getCalendarById(calendarMap[roomName]);
      if (!cal) throw new Error(`No access to calendar for "${roomName}". Share it with the script owner as "Make changes to events".`);
      return cal;
    };

    const conflictsFor = (cal, s, en) => {
      const windowStart = new Date(s.getTime() - 12 * 60 * 60 * 1000);
      const windowEnd = new Date(en.getTime() + 12 * 60 * 60 * 1000);
      return cal.getEvents(windowStart, windowEnd).filter(ev => ev.getStartTime() < en && ev.getEndTime() > s);
    };

    // ---------- Extract form fields ----------
    const requesterEmail = pick("Email Address");
    const therapist = pick("Therapist Name");
    const encounter = pick("Encounter Type");
    const requestedRoom = pick("Room");
    const dateStr = pick("Date of Service");
    const startStr = pick("Start Time");
    const endStr = pick("End Time");
    const notes = pick("Additional Comments");

    // ---------- Validation ----------
    if (!requestedRoom) throw new Error('Room is blank. Make sure the Room question title is exactly "Room" and Required.');
    if (!calendarMap[requestedRoom]) throw new Error(`Room "${requestedRoom}" must be one of: ${Object.keys(calendarMap).join(", ")}`);
    if (!dateStr || !startStr || !endStr) throw new Error("Missing Date/Start/End. Make those questions Required.");

    const day = new Date(dateStr);
    if (isNaN(day)) throw new Error("Invalid date: " + dateStr);

    const st = parseTime(startStr);
    const et = parseTime(endStr);
    const start = new Date(day); start.setHours(st.h, st.m, 0, 0);
    const end = new Date(day); end.setHours(et.h, et.m, 0, 0);
    if (end <= start) throw new Error("End Time must be after Start Time.");

    const startBuffered = new Date(start.getTime() - BUFFER_MINUTES * 60 * 1000);
    const endBuffered = new Date(end.getTime() + BUFFER_MINUTES * 60 * 1000);

    // ---------- Room assignment ----------
    const roomOrder = [requestedRoom, ...Object.keys(calendarMap).filter(x => x !== requestedRoom)];
    let assignedRoom = null, assignedCal = null, requestedRoomConflicts = [];

    for (const roomName of roomOrder) {
      const cal = getCalOrThrow(roomName);
      const conflicts = conflictsFor(cal, startBuffered, endBuffered);
      if (roomName === requestedRoom) requestedRoomConflicts = conflicts;
      if (conflicts.length === 0) {
        assignedRoom = roomName;
        assignedCal = cal;
        break;
      }
    }

    if (!assignedCal) {
      const conflictText = requestedRoomConflicts.slice(0, 5).map(ev =>
        `${ev.getTitle()} (${ev.getStartTime().toLocaleString()}–${ev.getEndTime().toLocaleString()})`
      ).join("\n") || "(No conflict details available)";

      const msg =
        `Room request could NOT be scheduled.\n\n` +
        `Therapist: ${therapist || "(unknown)"}\n` +
        `Encounter: ${encounter || "(unknown)"}\n` +
        `Requested Room: ${requestedRoom}\n` +
        `Time: ${start.toLocaleString()} – ${end.toLocaleString()}\n\n` +
        `Conflicts:\n${conflictText}\n\n` +
        (notes ? `Notes: ${notes}\n` : "");
      MailApp.sendEmail(ADMIN_EMAIL, `Room Request FAILED (${requestedRoom})`, msg);
      return;
    }

    const finalConflicts = conflictsFor(assignedCal, startBuffered, endBuffered);
    if (finalConflicts.length > 0) throw new Error(`Double-book prevented: "${assignedRoom}" became unavailable right before creation.`);

    // ---------- Create event ----------
    const title = `${therapist || "Therapist"}  ${encounter || "Session"}`;
    const description =
      `Therapist: ${therapist || "Therapist"}\n` +
      `Therapist Email: ${requesterEmail || "(missing)"}\n` +
      `Requested Room: ${requestedRoom}\n` +
      (assignedRoom !== requestedRoom ? `Assigned Room: ${assignedRoom}\n\n` : `\n`) +
      (notes ? `Notes: ${notes}\n` : "");

    assignedCal.createEvent(title, start, end, {
      description,
      guests: requesterEmail || undefined,
      sendInvites: false
    });

    // ---------- Notify requester ----------
    if (requesterEmail) {
      const gotRequested = assignedRoom === requestedRoom;
      const subject = gotRequested ? `Room Confirmed: ${assignedRoom}` : `Room Assigned: ${assignedRoom}`;
      const msg =
        `Your room request has been processed.\n\n` +
        `Therapist: ${therapist || "(unknown)"}\n` +
        `Encounter: ${encounter || "(unknown)"}\n` +
        `Requested Room: ${requestedRoom}\n` +
        `Assigned Room: ${assignedRoom}\n` +
        `Time: ${start.toLocaleString()} – ${end.toLocaleString()}\n\n` +
        (gotRequested
          ? `Your requested room was available and has been confirmed.`
          : `Your requested room was unavailable, so a different room was assigned.`) +
        `\n\nYou can confirm your reservation on your internal calendar.`;
      MailApp.sendEmail(requesterEmail, subject, msg);
    }

  } catch (err) {
    const msg = `Room automation error:\n\n${err && err.stack ? err.stack : err}`;
    try { MailApp.sendEmail(ADMIN_EMAIL, "Room Automation ERROR", msg); } catch (_) {}
    throw err;
  } finally {
    lock.releaseLock();
  }
}


// ---------- DAILY SUMMARY FUNCTION ----------
function sendDailyRoomSummaries(date) {
  if (!(date instanceof Date)) date = new Date();

  const tz = Session.getScriptTimeZone() || "America/New_York";
  const dayStart = new Date(Utilities.formatDate(date, tz, "yyyy-MM-dd'T'HH:mm:ss"));
  dayStart.setHours(8, 0, 0, 0);

  const dayEnd = new Date(Utilities.formatDate(date, tz, "yyyy-MM-dd'T'HH:mm:ss"));
  dayEnd.setHours(21, 59, 0, 0);

  const eventsByTherapist = {};

  for (const roomName of Object.keys(calendarMap)) {
    const cal = CalendarApp.getCalendarById(calendarMap[roomName]);
    if (!cal) continue;

    const events = cal.getEvents(dayStart, dayEnd);
    events.forEach(ev => {
      const desc = ev.getDescription() || "";
      const therapistName = (desc.match(/^Therapist:\s*(.+)$/mi) || [])[1] || "Therapist";
      const therapistEmail = (desc.match(/^Therapist Email:\s*(.+)$/mi) || [])[1] || therapistEmailMap[therapistName.toLowerCase()] || "";
      if (!therapistEmail) return;

      const encounter = (ev.getTitle() || "").split(/\s{2,}/)[1] || "Session";
      const key = therapistEmail.toLowerCase();

      if (!eventsByTherapist[key]) eventsByTherapist[key] = { name: therapistName, email: therapistEmail, items: [] };
      eventsByTherapist[key].items.push({
        room: roomName,
        start: Utilities.formatDate(ev.getStartTime(), tz, "h:mm a"),
        end: Utilities.formatDate(ev.getEndTime(), tz, "h:mm a"),
        encounter
      });
    });
  }

  Object.values(eventsByTherapist).forEach(({ name, email, items }) => {
    if (!email || items.length === 0) return;
    const subject = "Today's Room Assignments";
    const body =
      `Hi ${name},\n\n` +
      `These are your room assignments for today:\n\n` +
      items.map(x => `- ${x.room}: ${x.start}–${x.end} (${x.encounter})`).join("\n") +
      `\n\nIf you need to report any changes please respond to this email.`;
    MailApp.sendEmail(email, subject, body);
  });
}
