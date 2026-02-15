# Google Workspace Room Scheduling Automation

Production-deployed Google Workspace room scheduling automation built with Apps Script and Google Calendar API to prevent double-booking and streamline clinical operations.

## Production Use

This system was deployed in a live clinical environment to automate therapist room scheduling. It reduced manual coordination, prevented double-booking, and streamlined daily room assignment communication.

## Usage

1. User fills out a Google Form with room request details.
2. Your script assigns a room and sends a confirmation email.
3. At a scheduled time every morning, the script sends daily room summaries.

**Sample confirmation email:**
> Room Confirmed: Room A  
> Therapist: Jane Doe  
> Time: 9:00 AM – 10:00 AM

## Problem

Manual room scheduling led to booking conflicts and inefficiencies. This system automates the entire reservation workflow from form submission to calendar event creation and daily reporting.

## Tech Stack

- Google Apps Script
- Google Calendar API
- Google Forms trigger events
- LockService for concurrency control
- Automated email notifications

## Core Features

- Triggered on form submission
- Input normalization and validation
- Flexible time parsing (12hr and 24hr formats)
- Buffer time enforcement
- Multi-room fallback logic
- Conflict detection across calendars
- Automatic reassignment if room unavailable
- Admin alerting for failures
- Daily summary emails grouped by therapist
- Race condition prevention using script locking

## System Logic Overview

1. Form submission triggers `onFormSubmit`.
2. Lock acquired to prevent simultaneous double-booking.
3. Room availability checked with buffer window.
4. If requested room unavailable → next available room assigned.
5. Event created in appropriate Google Calendar.
6. Confirmation email sent to therapist.
7. Daily summary emails generated per therapist.

## Engineering Considerations

- Concurrency handled using `LockService`.
- Buffer window prevents back-to-back booking conflicts.
- Defensive error handling with admin alerts.
- Calendar access validation.

## Future Improvements

- Admin dashboard UI
- Room usage analytics
- Preference-based scheduling
- Database-backed tracking

## Setup

1. Open the **Google Sheet** that is linked to your Google Form (this Sheet stores form responses).
2. Go to **Extensions → Apps Script** from that Sheet.
3. In the Apps Script editor, create a new script file (e.g., `Code.gs`).
4. Copy the contents of `src/Code.gs` into your new script file.
5. Configure your script:
   - Replace `calendarMap` entries with your own Google Calendar IDs.
   - Replace or set `ADMIN_EMAIL` with your admin email address:
     ```javascript
     const ADMIN_EMAIL = "example@example.com";
     ```
   - Optional: Add name‑to‑email mappings in `therapistEmailMap` if you want different email handling.
6. Set up triggers:
   - **Form submit trigger → `onFormSubmit`**
     - In the Apps Script editor, open **Triggers** (clock icon) → Add trigger → choose `onFormSubmit` → Event type: `From form submit`
     - This ensures each form submission automatically checks availability and updates the calendar.
   - Optional: **Time‑driven trigger → `sendDailyRoomSummaries`**
     - Create a daily trigger (e.g., 8:00 AM) to send summary emails to staff about their scheduled rooms for the day.

**Flow Overview:**  
- Form submission → Sheet responses → Apps Script onFormSubmit → Calendar event creation → Confirmation & summary emails.

## How to Run

- **Automatic execution (recommended)**:  
  Once the script is bound to your Google Sheet and the triggers are set:
  1. Each form submission will automatically run `onFormSubmit`.
  2. Daily summary emails will be sent automatically if the time-driven trigger for `sendDailyRoomSummaries` is enabled.

- **Manual execution (for testing)**:  
  1. Open the Apps Script editor from your Sheet (**Extensions → Apps Script**).  
  2. Select the function `onFormSubmit` or `sendDailyRoomSummaries` from the dropdown.  
  3. Click the **Run ▶** button to execute the function manually.  
     - You may need to provide a mock `e` object for testing `onFormSubmit`.
  4. Check your Google Calendar and email to confirm the script is working correctly.


