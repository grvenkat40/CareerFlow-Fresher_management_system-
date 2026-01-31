🧱 Project 1
Student / Fresher Career Management System

-----------------------------------------------------------------------------------------------------------------

1️⃣ Introduction (How you should explain it)

Student / Fresher Career Management System is a web-based platform designed to help students and fresh graduates systematically manage their job search, skill development, and interview preparation in one centralized place.

Instead of using:

Excel sheets

Notes apps

Random job portals

WhatsApp reminders

This system provides a structured, data-driven approach to career planning.

-----------------------------------------------------------------------------------------------------------------

2️⃣ The REAL Problem (Current Industry Reality)

Let’s be brutally honest.

🔴 Problems students face today

Job applications are scattered across platforms (LinkedIn, Naukri, referrals)

No visibility on:

How many jobs applied

Which roles get responses

No tracking of interview feedback

No data to answer:

“What am I doing wrong?”

-----------------------------------------------------------------------------------------------------------------

🔴 Problems recruiters indirectly face

Poorly prepared candidates

No consistency in applications

No learning from past rejections

Same mistakes repeated

This project targets both sides indirectly.

-----------------------------------------------------------------------------------------------------------------

3️⃣ How This Project Solves the Problem

Your system introduces structure + visibility + accountability.

Core idea:

“What gets tracked, gets improved.”

What the system enables:

Centralized job application tracking

Clear application status flow

Notes & feedback storage

Data-driven reflection

-----------------------------------------------------------------------------------------------------------------

4️⃣ Real-World Impact (This is IMPORTANT)
👨‍🎓 For Students / Freshers

Organized job search

Reduced stress & confusion

Better preparation for interviews

Faster improvement cycle

🏢 For Institutions (Future scope)

Track placement readiness

Identify weak skill areas

Improve placement training

-----------------------------------------------------------------------------------------------------------------

6️⃣ High-Level System View (Think like this)
User
 ↓
Web Interface
 ↓
Django Backend
 ↓
Database
 ↓
Insights (Counts / Status / Trends)

-----------------------------------------------------------------------------------------------------------------

Database Schema Design

2️⃣ Identify the CORE ENTITIES (No Overthinking)

Ask: What objects exist in the real world?

For this system, the minimum real entities are:

User (student / fresher)

Job

Job Application

Application Notes

Skills (optional but powerful)

-----------------------------------------------------------------------------------------------------------------

3️⃣ Table-by-Table Design (THIS IS IMPORTANT)
🧍 1. users

(Use Django’s built-in User, extend later)

Purpose: Identify who is using the system.

Key fields:

id

username

email

password

created_at

📌 Engineer note:
Never reinvent auth. Use Django auth. Period.

💼 2. jobs

Purpose: Store job role details (independent of application)

Column	Type	Why
id	PK	Unique job
company_name	string	Core identifier
role	string	Job title
location	string	Interview relevance
job_type	enum	Full-time / Intern
source	string	LinkedIn, Referral
created_at	timestamp	Tracking

📌 Why separate jobs table?
Because multiple users may apply to the same role in future versions.

That’s forward-thinking.

📝 3. applications (MOST IMPORTANT TABLE)

This is the heart of the system.

Column	Type	Why
id	PK	Unique application
user_id	FK → users	Who applied
job_id	FK → jobs	Which job
status	enum	Applied / Interview / Offer / Rejected
applied_date	date	Timeline tracking
last_updated	timestamp	Status changes

📌 Engineer insight:
This table represents a workflow, not just data.

🗒️ 4. application_notes

Purpose: Capture interview feedback & reflections

Column	Type	Why
id	PK	Note id
application_id	FK → applications	Context
note	text	Feedback / thoughts
created_at	timestamp	Progress tracking

📌 This is gold in interviews.
Shows learning loop & self-improvement.

🧠 5. skills (Optional but HIGH SIGNAL)
Column	Type	Why
id	PK	Skill id
user_id	FK → users	Owner
skill_name	string	Python, SQL
level	enum	Beginner / Intermediate
last_practiced	date	Consistency

📌 This lets you later add:

Skill gaps

Interview readiness

Analytics

-----------------------------------------------------------------------------------------------------------------

4️⃣ Relationships (Say This in Interviews)
User 1 ────< Applications >──── 1 Job
              |
              |
           Notes


One user → many applications

One job → many applications

One application → many notes

That’s normalized, clean design.

-----------------------------------------------------------------------------------------------------------------

5️⃣ Status Flow (BUSINESS LOGIC)

Define this before coding:

Applied
   ↓
Interview
   ↓
Offer
   ↓
Accepted / Rejected


📌 Rule:

Status must change only forward (no chaos)

Every status change updates last_updated

This is workflow control — very engineer-like.

-----------------------------------------------------------------------------------------------------------------

6️⃣ MVP vs Future Scope (VERY IMPORTANT)
🎯 MVP (what you WILL build)

Users

Jobs

Applications

Status tracking

Notes

Dashboard counts

🚀 Future (just mention, don’t build)

Recruiter login

Resume upload

Notifications

Analytics trends

API integrations

Interviewers LOVE when you say:

“This was MVP-focused, but scalable.”

7️⃣ Write This in Your NOTES.md

I designed the database schema by first identifying real-world entities involved in a fresher’s job search.
The core workflow is represented by the Applications table, which tracks status transitions and learning notes.
The schema is normalized to support scalability and future features.

-----------------------------------------------------------------------------------------------------------------

User Stories

🔐 Authentication

US-01

As a student, I want to register and log in securely so that my job data is private.

✅ Acceptance:

Email + password login

Session-based auth

Logout support

👤 Profile Management

US-02

As a student, I want to maintain my profile so that I can track my career details in one place.

✅ Acceptance:

Basic info (name, email)

Optional education & target role

💼 Job Creation

US-03

As a student, I want to add job details so that I can record the roles I apply for.

✅ Acceptance:

Company name

Role

Location

Source (LinkedIn, Referral, etc.)

📝 Job Application Tracking (CORE)

US-04

As a student, I want to track the status of each job application so that I know where I stand.

✅ Acceptance:

Status options: Applied / Interview / Offer / Rejected

Status updates reflect in dashboard

Last updated timestamp

📌 This is the heart of the system.

🗒️ Interview Notes

US-05

As a student, I want to add notes to an application so that I can remember interview feedback and improve.

✅ Acceptance:

Multiple notes per application

Timestamped notes

Editable

📊 Dashboard Overview

US-06

As a student, I want to see a dashboard summary so that I can quickly understand my job search progress.

✅ Acceptance:

Total applications

Count by status

Recently updated applications

6️⃣ Map User Stories → DB (Engineer Move)


| User Story | Tables Used       |
| ---------- | ----------------- |
| US-01      | users             |
| US-02      | users             |
| US-03      | jobs              |
| US-04      | applications      |
| US-05      | application_notes |
| US-06      | applications      |
| US-09      | skills            |

9️⃣ API → USER STORY MAPPING (INTERVIEW GOLD)

| User Story        | API                          |
| ----------------- | ---------------------------- |
| Register/Login    | `/auth/*`                    |
| Add job           | `/jobs/`                     |
| Track application | `/applications/`             |
| Update status     | `/applications/{id}/status/` |
| Add notes         | `/applications/{id}/notes/`  |
| Dashboard         | `/dashboard/summary/`        |

🔟 Write This in NOTES.md (DO THIS)

The backend was designed using REST principles with clear separation of resources.
Business rules such as application status transitions are enforced at the API layer to ensure data consistency.

IMPLEMENTATION PHASE

Folder :- 
    - Project-1 SCMS
        (venv)scms ---> smcs\Scripts\activate
        (project)  ---> 
