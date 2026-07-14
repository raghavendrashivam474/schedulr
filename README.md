# Schedulr

> **Schedulr helps service-based businesses manage appointments, understand operations, and automate customer communication through an intelligent scheduling platform designed around time.**

---

# Project Status

🚧 **Active Development**

**Current Released Version:** **v0.6.0**

**Current Milestone:** **Sprint 7 – Appointment Communication & Reminder Automation Complete**

**Next Release:** **v0.7.0**

---

# The Problem

Many appointment-based businesses still rely on phone calls, WhatsApp messages, spreadsheets, paper diaries, or social media chats to manage bookings.

As businesses grow, these disconnected workflows often lead to:

* Double bookings
* Missed appointments
* Scheduling conflicts
* Manual customer follow-ups
* Poor customer experience
* Limited business visibility
* Administrative overhead

Even when appointments are successfully scheduled, another problem remains.

Time passes between booking and attendance.

During this period, customers may forget the appointment, lose the original booking details, or simply become unaware of an upcoming commitment.

Business owners also need to understand whether appointment volume is changing, which services are popular, when no-shows are increasing, and how customers are behaving.

Scheduling software should do more than record appointments.

It should help businesses **organize time, understand operations, and act automatically when work needs to happen.**

---

# What Schedulr Does

Schedulr is a scheduling, operational intelligence, and appointment automation platform built for businesses where **time is the primary resource**.

Businesses can:

* Create and manage their business presence
* Offer appointment-based services
* Configure weekly schedules and holidays
* Generate appointment slots dynamically
* Accept online bookings
* Manage appointments throughout their lifecycle
* Maintain customer records and booking history
* Build a professional public business profile
* Share business links and QR codes
* Monitor appointment performance
* Compare business activity across time periods
* Identify popular services and busy days
* Understand customer retention
* Receive deterministic operational insights
* Configure appointment reminder policies
* Automatically schedule future appointment reminders
* Deliver reminder communication through email
* Track reminder delivery outcomes

Schedulr is evolving from a scheduling application into an operational system capable of understanding business activity and independently executing future work.

---

# Who Is It For?

Schedulr is designed for appointment-driven businesses, including:

* Doctors and Clinics
* Tutors and Coaching Centers
* Salons and Spas
* Consultants
* Fitness Trainers
* Freelancers
* Legal Professionals
* Wellness Practitioners
* Repair & Maintenance Services
* Photography Studios

If your business depends on scheduled time, Schedulr is built to support your workflow.

---

# Current Platform Capabilities

## Identity & Business Foundation

* User authentication
* Session management
* Protected business workspace
* Business ownership
* Business onboarding

---

## Business Operations

* Service management
* Weekly schedule configuration
* Holiday management
* Business availability
* Booking policies

---

## Scheduling Intelligence

* Availability engine
* Dynamic appointment slot generation
* Intelligent booking validation
* Double-booking protection
* Public booking experience
* Booking management dashboard

---

## Appointment Lifecycle & Customers

* Automatic customer creation
* Customer management
* Customer appointment history
* Appointment lifecycle management
* Validated appointment status transitions
* Appointment timeline
* Email notification service

---

## Public Business Presence

* Unique business slugs
* Memorable public URLs
* Public business profiles
* Business branding
* Business descriptions
* Contact and social links
* Share center
* QR code generation
* Public booking entry

---

## Business Insights & Operational Intelligence

* Today, week, and month analytics ranges
* Appointment metrics
* Completion rate
* Cancellation rate
* No-show rate
* Upcoming appointment metrics
* Customer metrics
* New customer tracking
* Returning customer tracking
* Returning customer rate
* Current and previous period comparison
* Percentage change calculation
* Operational trend detection
* Appointment aggregation by status
* Appointment aggregation by service
* Appointment aggregation by day
* Service popularity analysis
* Busiest-day identification
* Deterministic operational insights
* Live intelligence dashboard

---

## Appointment Communication & Reminder Automation

* Business-specific reminder policies
* 24-hour reminder configuration
* 2-hour reminder configuration
* 30-minute reminder configuration
* Reminder planning from appointment time
* Automatic filtering of expired reminder times
* Persisted future reminder work
* Reminder lifecycle management
* Appointment lifecycle synchronization
* Pending reminder cancellation
* Atomic reminder claiming
* Duplicate processing protection
* Due-reminder discovery
* Background reminder processing
* Notification channel dispatch
* Automated email reminders
* Delivery success tracking
* Delivery failure tracking
* Secure machine-triggered execution
* Reminder communication history

---

# How Schedulr Works

Schedulr connects business configuration, customer discovery, appointment management, operational intelligence, and automated communication into one workflow.

```text
Business Configuration
        │
        ▼
Services & Availability
        │
        ▼
Public Business Presence
        │
        ▼
Customer Discovery
        │
        ▼
Appointment Booking
        │
        ▼
Appointment Lifecycle
        │
        ├───────────────────────┐
        │                       │
        ▼                       ▼
Operational Data        Reminder Planning
        │                       │
        ▼                       ▼
Metrics & Comparisons   Persisted Future Work
        │                       │
        ▼                       ▼
Patterns & Insights     Background Processing
        │                       │
        ▼                       ▼
Business Understanding  Customer Communication
```

---

# Customer Journey

Customers interact with the business rather than a technical booking system.

```text
Discover Business
        │
        ▼
Visit Public Profile
        │
        ▼
Understand the Business
        │
        ▼
Browse Services
        │
        ▼
View Business Hours
        │
        ▼
Book Appointment
        │
        ▼
Receive Confirmation
        │
        ▼
Receive Appointment Reminder
        │
        ▼
Visit Business
```

---

# Business Journey

Schedulr supports businesses from configuration to operational understanding and automation.

```text
Create Business
        │
        ▼
Configure Services
        │
        ▼
Set Availability
        │
        ▼
Publish Public Profile
        │
        ▼
Share Business Link
        │
        ▼
Receive Bookings
        │
        ▼
Manage Customers & Appointments
        │
        ▼
Configure Reminder Policy
        │
        ▼
Automate Appointment Communication
        │
        ▼
Track Appointment Outcomes
        │
        ▼
View Operational Intelligence
        │
        ▼
Understand Business Patterns
```

---

# Operational Intelligence

Schedulr does not treat analytics as a collection of charts.

The intelligence layer follows a structured pipeline.

```text
Operational Data
        │
        ▼
Metrics
"What happened?"
        │
        ▼
Comparison
"How did it change?"
        │
        ▼
Aggregation
"Where is the pattern?"
        │
        ▼
Insights
"What does it mean?"
        │
        ▼
Dashboard
"What should the owner notice?"
```

Insights are generated through deterministic rules.

No AI or probabilistic recommendation system is used for current operational insights.

The same analytics input produces the same result.

Current insights can identify:

* Most popular service
* Busiest appointment day
* Increasing no-show rates
* High no-show rates
* Growing booking volume
* Declining booking volume
* Strong customer retention
* High appointment completion rates

---

# Reminder Automation

Sprint 7 introduced time-driven execution.

Previously, Schedulr primarily operated through user interaction.

```text
User Action
     │
     ▼
Application Request
     │
     ▼
Schedulr Reacts
```

Schedulr can now persist future work and execute it when that work becomes due.

```text
Appointment Created
        │
        ▼
Reminder Policy
        │
        ▼
Reminder Planning
        │
        ▼
Persist Scheduled Work
        │
        ▼
Future Time Reached
        │
        ▼
Background Processor
        │
        ▼
Atomic Reminder Claim
        │
        ▼
Notification Dispatcher
        │
        ▼
Email Delivery
        │
        ▼
Lifecycle Outcome
```

This allows appointment communication to continue without a business owner or customer actively using the platform.

---

## Reminder Lifecycle

Every reminder has an explicit lifecycle.

```text
PENDING
   │
   ├──────► PROCESSING ──────► SENT
   │                │
   │                └────────► FAILED
   │
   └─────────────────────────► CANCELLED
```

Lifecycle outcomes remain visible.

Failed reminders are not silently treated as successful.

Cancelled reminders remain part of historical communication state.

---

## Duplicate Processing Protection

Background execution introduces concurrency risk.

Two processors may discover the same reminder simultaneously.

Schedulr protects reminder delivery through atomic claiming.

```text
Reminder
PENDING
   │
   ├──── Processor A ────► CLAIMED
   │
   └──── Processor B ────► SKIPPED
```

Only a processor that successfully transitions a reminder from `PENDING` to `PROCESSING` may dispatch it.

This prevents duplicate reminder delivery during competing execution.

---

## Appointment Lifecycle Synchronization

Reminder work follows appointment state.

### Appointment Cancellation

```text
Appointment CANCELLED
        │
        ▼
Find Pending Reminders
        │
        ▼
Mark Reminders CANCELLED
```

### Terminal Appointment State

Pending reminders are cancelled when an appointment reaches:

* CANCELLED
* NO_SHOW
* COMPLETED

This prevents communication from being delivered for appointments that are no longer active.

Historical sent and failed reminder records remain intact.

---

# Operational Feedback Loop

Business intelligence and reminder automation now form a product-level operational loop.

```text
Appointments
      │
      ▼
Operational Analytics
      │
      ▼
Insight

"No-show rate is high."
      │
      ▼
Reminder Automation
      │
      ▼
Customer Awareness
      │
      ▼
Appointment Outcomes
      │
      └──────────────► Operational Analytics
```

The product evolution is:

```text
Observe
   │
   ▼
Understand
   │
   ▼
Act
   │
   ▼
Observe Again
```

Analytics and reminder automation remain architecturally independent.

Business reminder policy controls automation.

Operational insights do not directly trigger reminder execution.

---

# See It In Action

The current platform includes:

* Business onboarding
* Service management
* Availability configuration
* Dynamic appointment slot generation
* Public business profiles
* Public booking experience
* Appointment lifecycle management
* Customer management
* Email notifications
* Share center
* QR code generation
* Operational analytics
* Period comparison
* Service and day analysis
* Deterministic business insights
* Live intelligence dashboard
* Business reminder settings
* Automatic reminder planning
* Background reminder processing
* Email reminder dispatch
* Reminder lifecycle tracking
* Secure cron execution boundary

🚧 Screenshots, GIFs, and a public live demo will be added in a future release.

---

# Getting Started

## Prerequisites

* Node.js 20+
* npm
* PostgreSQL 17+
* Git

---

## Installation

```bash
git clone https://github.com/raghavendrashivam474/schedulr.git

cd schedulr

npm install
```

Create a local environment file.

```bash
cp .env.example .env
```

Configure the required environment variables.

Run database migrations.

```bash
npx prisma migrate dev
```

Start the development server.

```bash
npm run dev
```

Open:

```text
http://localhost:3000
```

---

## Reminder Automation Configuration

Reminder background execution requires a machine credential.

Configure:

```text
REMINDER_CRON_SECRET=your-secure-secret
```

The protected reminder execution boundary is:

```text
/api/cron/reminders
```

Scheduled infrastructure should invoke this endpoint using:

```text
Authorization: Bearer <REMINDER_CRON_SECRET>
```

The application currently provides the secure execution endpoint.

An external scheduler must trigger it in deployed environments.

---

# Engineering Overview

Schedulr uses a modular, domain-oriented architecture focused on maintainability, business capability isolation, and long-term product evolution.

Technology supports the product workflow rather than defining it.

---

## Technology Stack

| Layer      | Technology         | Purpose                          |
| ---------- | ------------------ | -------------------------------- |
| Framework  | Next.js App Router | Full-stack application framework |
| Language   | TypeScript         | Type safety and maintainability  |
| Styling    | Tailwind CSS       | Consistent interface development |
| Database   | PostgreSQL         | Relational operational data      |
| ORM        | Prisma             | Type-safe database access        |
| Validation | Zod                | Runtime input validation         |
| Formatting | Prettier           | Code consistency                 |
| Linting    | ESLint             | Static code quality              |

---

# Architecture Principles

## Availability-First Scheduling

Business availability is the source of truth for scheduling decisions.

Services, schedules, holidays, existing bookings, and booking policies collectively determine whether an appointment can be created.

---

## Dynamic Slot Generation

Appointment slots are calculated on demand.

Slots are not permanently stored.

This avoids synchronization problems between stored slots and changing business availability.

---

## Persisted Future Work

Appointment slots and reminders intentionally follow different persistence strategies.

```text
Appointment Slots
        │
        ▼
Calculated On Demand
```

```text
Reminders
        │
        ▼
Persisted Future Work
```

A slot describes current availability and can be recalculated.

A reminder represents work the system intends to execute in the future and must retain lifecycle state.

---

## Double-Booking Protection

Booking availability is validated:

* During slot generation
* Immediately before booking persistence

This protects appointment integrity during concurrent booking activity.

---

## Atomic Work Claiming

Due reminder discovery does not grant permission to execute work.

A reminder must first be atomically claimed.

Conceptually:

```text
PENDING
   │
   ▼
Conditional Claim
   │
   ├── Success ──► PROCESSING
   │
   └── Failure ──► SKIP
```

This protects background processing against duplicate execution.

---

## Domain-Oriented Modules

Schedulr separates business capabilities into focused modules:

* Authentication
* Business
* Services
* Availability
* Booking
* Customers
* Appointment Lifecycle
* Public Profile
* Share Center
* Analytics
* Operational Insights
* Reminder Policy
* Reminder Planning
* Reminder Synchronization
* Reminder Processing
* Notification Dispatch

Each module owns a specific business responsibility.

---

## Layered Operational Intelligence

Analytics responsibilities remain separated.

```text
Time Range Engine
        │
        ▼
Metrics Engine
        │
        ▼
Comparison Engine
        │
        ▼
Aggregation Layer
        │
        ▼
Insight Engine
        │
        ▼
Analytics Service
        │
        ▼
Analytics API
        │
        ▼
Intelligence Dashboard
```

Analytics calculations do not belong inside API handlers or dashboard components.

---

## Deterministic Insights

Operational insights consume calculated analytics rather than querying raw data.

This makes insights:

* Reproducible
* Explainable
* Testable
* Predictable

AI-generated insights are intentionally excluded from the current architecture.

---

## Channel-Oriented Notification Dispatch

Reminder processing does not directly depend on an email provider.

```text
Reminder Processor
        │
        ▼
Notification Dispatcher
        │
        ▼
EMAIL
        │
        ▼
Email Service
```

Email is currently the only implemented reminder channel.

The dispatcher establishes a clean communication boundary without introducing unused SMS, WhatsApp, or push implementations.

---

## Multi-Tenant Data Isolation

Business data is scoped to the authenticated business.

Analytics, appointments, customers, services, reminder policies, and reminder communication history are resolved within business ownership boundaries.

Cross-business access is not permitted.

---

## Event-Oriented Growth

Future capabilities can react to appointment and operational events without moving unrelated logic into the booking engine.

Examples include:

* Calendar synchronization
* Payment workflows
* Review requests
* Follow-up communication
* Waitlist notifications
* External integrations
* Webhooks

---

# Project Structure

```text
schedulr/

src/
├── app/
│   ├── api/
│   │   ├── business/
│   │   ├── bookings/
│   │   └── cron/
│   │
│   ├── dashboard/
│   └── settings/
│
├── components/
│
├── config/
│
├── features/
│   ├── analytics/
│   │   ├── aggregation/
│   │   ├── engines/
│   │   ├── insights/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── reminders/
│   │   ├── dispatch/
│   │   ├── engines/
│   │   ├── services/
│   │   └── types/
│   │
│   ├── notifications/
│   │   └── templates/
│   │
│   └── ...
│
├── hooks/
├── middleware/
├── services/
├── types/
└── utils/

lib/
prisma/
docs/
tests/
public/
```

---

# Development Progress

## Completed

* ✅ Project foundation
* ✅ Authentication and session management
* ✅ Business onboarding and ownership
* ✅ Service management
* ✅ Weekly schedule configuration
* ✅ Holiday management
* ✅ Availability engine
* ✅ Dynamic slot generation
* ✅ Booking validation
* ✅ Double-booking protection
* ✅ Public booking experience
* ✅ Appointment lifecycle management
* ✅ Customer management
* ✅ Appointment timeline
* ✅ Email notification service
* ✅ Public business profiles
* ✅ Business branding
* ✅ Business slug system
* ✅ Share center
* ✅ QR code generation
* ✅ Analytics time ranges
* ✅ Operational metrics
* ✅ Period comparison
* ✅ Operational trend calculation
* ✅ Service aggregation
* ✅ Day-of-week aggregation
* ✅ Status aggregation
* ✅ Returning customer analysis
* ✅ Deterministic insight generation
* ✅ Operational intelligence dashboard
* ✅ Reminder domain and lifecycle
* ✅ Business reminder policies
* ✅ Reminder planning engine
* ✅ Persisted future reminder work
* ✅ Appointment reminder synchronization
* ✅ Due-reminder discovery
* ✅ Atomic reminder claiming
* ✅ Duplicate processing protection
* ✅ Background reminder processor
* ✅ Notification dispatcher
* ✅ Automated email reminders
* ✅ Reminder delivery tracking
* ✅ Secure background execution boundary
* ✅ Reminder settings interface
* ✅ Communication history API

---

## Planned

* External production cron scheduler configuration
* Appointment rescheduling
* Communication history interface
* Customer attendance confirmation
* Automatic reminder retry strategy
* Calendar synchronization
* SEO optimization
* File uploads
* Rate limiting
* Analytics caching
* Multi-staff scheduling
* Payment integration
* Mobile applications
* Public API
* Webhooks
* Third-party integrations

---

# Roadmap

## Phase 1 – Core Platform ✅

* Project Foundation
* Identity & Business Ownership
* Business Operations
* Scheduling Intelligence
* Appointment Lifecycle
* Public Business Presence

---

## Phase 2 – Business Productivity 🚧

* ✅ Business Insights
* ✅ Operational Intelligence
* ✅ Appointment Communication
* ✅ Reminder Automation
* Background Execution Deployment
* Calendar Synchronization
* SEO
* File Uploads

---

## Phase 3 – Growth Platform

* Multi-staff scheduling
* Payment processing
* Public APIs
* Webhooks
* Marketplace integrations
* Mobile applications
* Advanced operational intelligence

---

# Current Product Evolution

Schedulr has evolved through seven foundational product questions.

| Sprint   | Product Question                        |
| -------- | --------------------------------------- |
| Sprint 1 | Who owns the business?                  |
| Sprint 2 | What does the business offer and when?  |
| Sprint 3 | When can a customer book?               |
| Sprint 4 | What happens after a booking?           |
| Sprint 5 | How do customers discover the business? |
| Sprint 6 | What is happening inside the business?  |
| Sprint 7 | How does the platform act on its own?   |

The product evolution now follows:

```text
Foundation
     │
     ▼
Business Operations
     │
     ▼
Scheduling
     │
     ▼
Appointment Lifecycle
     │
     ▼
Customer Discovery
     │
     ▼
Operational Intelligence
     │
     ▼
Automation
```

Schedulr can now:

```text
Observe
   │
   ▼
Understand
   │
   ▼
Act
```

The next product phase can build on this foundation by improving reliability, communication depth, integrations, and operational scale.

---

# Current Limitations

## Timezone Handling

Schedulr currently uses JavaScript `Date` values with timestamps persisted through Prisma and PostgreSQL.

Application-created reminder workflows operate consistently through the current date layer.

A dedicated business-timezone abstraction has not yet been introduced.

---

## Reminder Retry

Failed reminders remain in the `FAILED` state.

Automatic retry, exponential backoff, poison-message handling, and dead-letter processing are not currently implemented.

Failure outcomes remain visible rather than being silently retried.

---

## Appointment Rescheduling

The reminder synchronization layer supports reminder resynchronization conceptually and includes a resync service function.

Appointment rescheduling is not currently exposed as a product workflow.

---

## External Scheduler

Schedulr provides a secure background execution endpoint.

The repository does not currently configure the external scheduler responsible for periodically invoking it in production.

---

## Production Rate Limiting

Rate limiting remains a required production hardening capability.

It should be addressed before public production deployment.

---

# Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

4. Push your branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

Please follow the existing architecture, coding standards, domain boundaries, and documentation conventions.

---

# Author

**Raghavendra Singh**

Computer Science Engineering Student

Building scalable software products through clean architecture, thoughtful engineering, operational intelligence, automation, and user-centered product development.

**GitHub**

https://github.com/raghavendrashivam474

---

# License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and build upon this software in accordance with the terms of the MIT License.

See the **LICENSE** file for the complete license text.
