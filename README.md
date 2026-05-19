# 🏥 Google Workspace Resource Scheduling & Workflow Orchestration System

🚀 Production-deployed Google Workspace automation system built with Apps Script and Google Calendar API to manage room scheduling, prevent conflicts, and streamline clinical workflow operations.

This system was deployed in a live clinical environment to automate therapist room scheduling, reduce manual coordination, and eliminate double-booking through rule-based workflow orchestration.

---

## 🧠 System Overview

This system automates a resource-constrained scheduling environment where multiple users, rooms, and time slots must be coordinated without conflicts.

It models a real-world **workflow orchestration system** where incoming requests are processed, validated, assigned, and recorded across Google Workspace tools.

---

## 🚨 Problem Statement

Manual scheduling processes led to:

- ❌ Double-booked rooms  
- ❌ Inefficient manual coordination  
- ❌ Lack of centralized scheduling visibility  
- ❌ Communication delays between staff  

This system automates the entire scheduling workflow from request submission to calendar assignment and confirmation delivery.

---

## ⚙️ System Architecture & Workflow

### 🔄 End-to-End Flow

1. 📋 User submits room request via Google Form  
2. 📊 Response is recorded in Google Sheets  
3. ⚙️ `onFormSubmit` trigger activates automation script  
4. 🧠 System evaluates room availability and constraints  
5. 🏢 Room is assigned or reassigned based on availability logic  
6. 📅 Calendar event is created in Google Calendar  
7. 📩 Confirmation email is sent to therapist  
8. 📈 Daily summary reports are generated per provider  

---

## 🧠 Core System Logic

- 🏢 Multi-resource scheduling (rooms, staff, time slots)  
- 🚫 Conflict detection and prevention rules  
- ⏱️ Buffer time enforcement between bookings  
- 🔁 Multi-room fallback assignment logic  
- 🧾 Automated scheduling validation engine  
- 🧠 Rule-based decision system for allocation  
- 📈 Daily aggregation and reporting system  

---

## 🏥 Production Use Case

This system was deployed in a live clinical environment to:

- 🏥 Automate therapist room scheduling  
- 🚫 Eliminate double-booking conflicts  
- ⚡ Improve operational efficiency  
- 📋 Standardize scheduling communication  
- 🧑‍💼 Reduce administrative workload  

---

## ☁️ Cloud & Scalability Perspective

Although built on Google Apps Script, this system is designed using **cloud architecture principles** and can be extended into:

- ☁️ AWS serverless scheduling systems (Lambda + API Gateway + DynamoDB)  
- ☁️ Azure workflow automation services  
- 🧩 Microservice-based booking platforms  
- 🔌 API-driven scheduling orchestration engines  

---

## 🛠 Tech Stack

- ⚙️ Google Apps Script  
- 📅 Google Calendar API  
- 📋 Google Forms (trigger input source)  
- 📊 Google Sheets (data persistence layer)  
- 🔒 LockService (concurrency control)  
- 📩 Gmail API (email automation)  

---

## 🚀 Core Features

- ⚡ Triggered automation via form submission  
- 🧼 Input validation and normalization  
- 🕒 Flexible time parsing (12h / 24h formats)  
- ⏱️ Buffer time enforcement for scheduling safety  
- 🔁 Multi-room fallback logic for conflicts  
- 📅 Cross-calendar conflict detection  
- 📩 Automated confirmation emails  
- 📈 Daily summary reports per therapist  
- 🔒 Race condition prevention using locking  
- 🚨 Admin failure alerting system  

---

## 🔐 Engineering Considerations

- 🔒 Concurrency handled via `LockService`  
- 🧯 Defensive error handling with admin alerts  
- 📅 Calendar validation ensures scheduling integrity  
- ⏱️ Buffer windows prevent overlapping bookings  
- 🧠 Structured logic supports future scaling  

---

## 🧪 Setup & Deployment

### 1. Script Installation

1. Open the Google Sheet linked to the Google Form  
2. Navigate to **Extensions → Apps Script**  
3. Open or create `Code.gs`  
4. Paste project script into editor  

---

## ⚙️ Configuration

### 📅 Calendar Mapping

```javascript
calendarMap
```

### 📩 Admin Email

```javascript
const ADMIN_EMAIL = "example@example.com";
```

Optional: configure therapist email mapping for notifications.

---

## 🔄 Triggers Setup

### 📋 Form Submission Trigger
- Function: `onFormSubmit`  
- Event: Google Form submission  

### 📈 Daily Summary Trigger (Optional)
- Function: `sendDailyRoomSummaries`  
- Schedule: Daily (recommended 8:00 AM)  

---

## 🧭 Manual Testing

For debugging or testing:

1. Open Apps Script editor  
2. Select function (`onFormSubmit` or `sendDailyRoomSummaries`)  
3. Click **Run ▶**

### ✅ Verify:
- 📅 Google Calendar event creation  
- 📩 Email notifications  
- 📜 Execution logs  

---

## 🔮 Future Improvements

- 📊 Admin dashboard for scheduling visibility  
- 📈 Room utilization analytics  
- 🧠 Preference-based scheduling rules  
- 🗄️ Database-backed scheduling engine  
- ☁️ Migration to AWS/Azure cloud architecture  
- 🏢 Multi-location scheduling support  

---
