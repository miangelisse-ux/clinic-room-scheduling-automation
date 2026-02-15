# Google Workspace Room Scheduling Automation

Production-deployed Google Workspace room scheduling automation built with Apps Script and Google Calendar API to prevent double-booking and streamline clinical operations.

## Production Use

This system was deployed in a live clinical environment to automate therapist room scheduling. It reduced manual coordination, prevented double-booking, and streamlined daily room assignment communication.

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

1. Create a Google Apps Script project.
2. Copy the contents of `src/Code.gs` into your project.
3. Configure calendars:
   - Replace IDs in `calendarMap` with your Google Calendar IDs.
4. Set admin email:

```javascript
const ADMIN_EMAIL = "example@example.com";
```
5. Optional: Map therapist names to emails in therapistEmailMap.
6. Set up triggers:

```
Form submit trigger → onFormSubmit

Time-driven trigger → sendDailyRoomSummaries (daily at 8:00 AM)
```
