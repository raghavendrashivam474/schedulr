# Schedulr

> **Schedulr helps service-based businesses manage appointments, understand operations, and build stronger customer experiences through an intelligent scheduling platform designed around time.**

---

# Project Status

🚧 **Active Development**

**Current Version:** **v0.6.0**

**Current Milestone:** **Sprint 6 – Business Insights & Operational Intelligence Complete**

**Next Milestone:** **Sprint 7 – Appointment Communication & Reminder Automation**

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

Even when businesses successfully manage appointments, understanding operational performance remains difficult.

Business owners often cannot quickly answer simple questions:

* Are appointments increasing?
* Which service is most popular?
* Which days are busiest?
* Are customers returning?
* Are cancellations increasing?
* Are no-shows becoming a problem?

Scheduling software should do more than record appointments.

It should help businesses understand how they operate.

---

# What Schedulr Does

Schedulr is a scheduling and operational intelligence platform built for businesses where **time is the primary resource**.

Businesses can:

* Create and manage their business presence
* Offer appointment-based services
* Configure weekly schedules and holidays
* Generate available appointment slots dynamically
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

Schedulr is designed to evolve from a single-professional scheduling platform into a broader operational system for service businesses.

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

# How Schedulr Works

Schedulr connects business configuration, customer discovery, appointment management, and operational intelligence into one workflow.

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
        ▼
Operational Data
        │
        ▼
Metrics & Comparisons
        │
        ▼
Patterns & Insights
        │
        ▼
Business Understanding
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
Visit Business
```

---

# Business Journey

Schedulr supports the business from configuration to operational understanding.

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

The same analytics input always produces the same result.

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

## Double-Booking Protection

Booking availability is validated:

* During slot generation
* Immediately before booking persistence

This protects appointment integrity during concurrent booking activity.

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

Each module owns its business responsibility.

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

## Multi-Tenant Data Isolation

Business data is scoped to the authenticated business.

Analytics, appointments, customers, services, and operational data are resolved within business ownership boundaries.

Cross-business analytics access is not permitted.

---

## Event-Oriented Growth

Future capabilities can react to appointment and operational events without moving unrelated logic into the booking engine.

Examples include:

* Appointment reminders
* Calendar synchronization
* Payment workflows
* External integrations
* Webhooks

---

# Project Structure

```text
schedulr/

src/
├── app/
│   ├── api/
│   └── dashboard/
│
├── components/
│   └── dashboard/
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

---

## Planned

* Appointment reminder automation
* Customer attendance confirmation
* Background job processing
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
* Appointment Communication
* Reminder Automation
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

Schedulr has evolved through six foundational questions.

| Sprint   | Product Question                        |
| -------- | --------------------------------------- |
| Sprint 1 | Who owns the business?                  |
| Sprint 2 | What does the business offer and when?  |
| Sprint 3 | When can a customer book?               |
| Sprint 4 | What happens after a booking?           |
| Sprint 5 | How do customers discover the business? |
| Sprint 6 | What is happening inside the business?  |

The next phase focuses on allowing Schedulr to act on the operational problems it identifies.

For example:

```text
Operational Insight

"No-show rate is increasing."
        │
        ▼
Appointment Communication
        │
        ▼
Automated Reminder
        │
        ▼
Customer Notification
        │
        ▼
Improved Attendance
```

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

Building scalable software products through clean architecture, thoughtful engineering, operational intelligence, and user-centered product development.

**GitHub**

https://github.com/raghavendrashivam474

---

# License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and build upon this software in accordance with the terms of the MIT License.

See the **LICENSE** file for the complete license text.
