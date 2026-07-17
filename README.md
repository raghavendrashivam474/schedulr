# Schedulr

> **An intelligent appointment scheduling and business operations platform for service-based businesses.**

Schedulr helps appointment-driven businesses manage bookings, understand business performance, automate customer communication, and reliably execute future work through a scheduling platform built around **time**.

---

## Project Status

🚧 **Active Development**

**Current Version:** `v0.8.0`

**Current Milestone:** Sprint 8 — Appointment Change & Automation Reliability

---

# Why Schedulr?

Most appointment scheduling software focuses on one thing—creating bookings.

Running a real business involves much more than that.

Business owners need to:

- Manage services
- Configure availability
- Accept online bookings
- Track customers
- Understand operational trends
- Communicate with customers
- Adapt when appointments change
- Ensure automation continues reliably

Schedulr brings these capabilities together into a single platform designed specifically for businesses where **time is the primary resource.**

---

# The Problem

Many appointment-driven businesses still rely on:

- Phone calls
- WhatsApp chats
- Paper diaries
- Excel sheets
- Social media messages

As businesses grow, these disconnected workflows often lead to:

- Double bookings
- Missed appointments
- Manual reminder calls
- Scheduling conflicts
- Administrative overhead
- Poor customer experience
- Limited operational visibility

Scheduling software should do more than record appointments.

It should help businesses organize time, understand operations, and automatically perform future work.

---

# What Schedulr Does

Schedulr combines scheduling, operational intelligence, and automation into one platform.

Businesses can:

- Create their business workspace
- Manage services
- Configure weekly schedules
- Configure holidays
- Generate appointment slots dynamically
- Accept public bookings
- Manage appointment lifecycle
- Maintain customer history
- Track operational performance
- Configure reminder policies
- Automatically send appointment reminders
- Safely reschedule appointments
- Recover from communication failures
- Monitor automation health

---

# Who Is It For?

Schedulr is designed for businesses that operate primarily through appointments.

Examples include:

- Doctors & Clinics
- Salons & Spas
- Tutors
- Coaching Institutes
- Consultants
- Fitness Trainers
- Lawyers
- Freelancers
- Repair Services
- Wellness Professionals

---

# Current Platform Capabilities

## Identity & Business

- Authentication
- Session Management
- Business Ownership
- Business Onboarding

---

## Business Operations

- Service Management
- Weekly Availability
- Holiday Management
- Booking Policies

---

## Scheduling

- Dynamic Slot Generation
- Availability Engine
- Booking Validation
- Double Booking Protection
- Public Booking Experience

---

## Appointment Lifecycle

- Customer Management
- Appointment Timeline
- Status Management
- Email Notifications

---

## Public Presence

- Public Business Profiles
- Business URLs
- QR Code Sharing
- Branding

---

## Operational Intelligence

- Business Analytics
- Customer Metrics
- Service Performance
- Period Comparison
- Operational Insights
- Live Dashboard

---

## Reminder Automation

- Reminder Policies
- Reminder Planning
- Background Processing
- Email Reminders
- Delivery Tracking
- Reminder Lifecycle

---

## Appointment Reliability

Sprint 8 significantly extends the scheduling engine by introducing reliable operational workflows.

New capabilities include:

- Appointment Rescheduling
- Appointment Change History
- Reminder Resynchronization
- Retry Lifecycle
- Retry Scheduling
- Retry-aware Background Processing
- Automation Health Dashboard

---

# How Schedulr Works

```text
Business Configuration
        │
        ▼
Service Configuration
        │
        ▼
Availability
        │
        ▼
Public Booking
        │
        ▼
Appointment Lifecycle
        │
        ├─────────────────────┐
        ▼                     ▼
Operational Data      Reminder Planning
        │                     │
        ▼                     ▼
Business Insights   Persisted Future Work
                              │
                              ▼
                   Background Processing
                              │
                              ▼
                     Retry & Recovery
                              │
                              ▼
                 Automation Monitoring
```

---

# Appointment Change Flow

Appointments are treated as the source of truth.

Whenever an appointment changes, future reminder work is recalculated automatically.

```text
Appointment

      │

      ▼

Reschedule

      │

      ▼

Validate Availability

      │

      ▼

Update Appointment

      │

      ▼

Record Change History

      │

      ▼

Cancel Future Reminders

      │

      ▼

Plan New Reminders
```

---

# Reminder Automation

Reminder automation allows Schedulr to continue working even when nobody is actively using the application.

```text
Appointment

      │

      ▼

Reminder Policy

      │

      ▼

Reminder Planning

      │

      ▼

Persist Future Work

      │

      ▼

Background Processor

      │

      ▼

Notification Dispatcher

      │

      ▼

Email Delivery
```

---

# Engineering Principles

Schedulr follows several architectural principles.

## Availability First

Business availability is the source of truth.

---

## Dynamic Scheduling

Appointment slots are generated on demand instead of being permanently stored.

---

## Persisted Future Work

Reminder tasks represent future work and therefore maintain their own lifecycle.

---

## Deterministic Automation

Reminder processing and retry behaviour always produce predictable outcomes.

---

## Operational Intelligence

Analytics are generated through deterministic business rules instead of probabilistic AI systems.

---

## Domain-Oriented Design

Each business capability owns its own responsibilities while remaining loosely coupled with the rest of the platform.

---

# Technology Stack

| Layer | Technology |
|--------|------------|
| Framework | Next.js App Router |
| Language | TypeScript |
| Database | PostgreSQL |
| ORM | Prisma |
| Styling | Tailwind CSS |
| Validation | Zod |
| Authentication | Better Auth |
| Package Manager | npm |

---

# Project Structure

```text
src/

├── app/

├── components/

├── features/

│   ├── analytics/

│   ├── appointments/

│   ├── bookings/

│   ├── reminders/

│   ├── notifications/

│   └── business/

├── lib/

├── prisma/

└── utils/
```

---

# Getting Started

## Prerequisites

- Node.js 20+
- PostgreSQL
- npm

## Installation

```bash
git clone <repository-url>

cd schedulr

npm install
```

Create your environment file.

```bash
cp .env.example .env
```

Run database migrations.

```bash
npx prisma migrate dev
```

Start the development server.

```bash
npm run dev
```

---

# Development Progress

### Completed

- Authentication
- Business Management
- Scheduling Engine
- Public Booking
- Appointment Lifecycle
- Customer Management
- Operational Analytics
- Reminder Automation
- Appointment Rescheduling
- Retry & Recovery
- Automation Operations

---

### Planned

- Calendar Integration
- Payment Integration
- Multi-Staff Scheduling
- Public API
- Mobile Applications
- File Uploads
- Rate Limiting
- Advanced Operational Intelligence

---

# Roadmap

## Phase 1 — Core Scheduling ✅

- Business Foundation
- Scheduling Engine
- Appointment Lifecycle
- Public Booking

---

## Phase 2 — Business Productivity 🚧

- Operational Intelligence
- Reminder Automation
- Appointment Reliability
- Background Operations

---

## Phase 3 — Platform Growth

- Multi-Staff Scheduling
- Payments
- Calendar Sync
- APIs
- Webhooks
- Mobile Apps

---

# Product Evolution

| Sprint | Product Question |
|---------|------------------|
| Sprint 1 | Who owns the business? |
| Sprint 2 | What does the business offer? |
| Sprint 3 | When can customers book? |
| Sprint 4 | What happens after booking? |
| Sprint 5 | How do customers discover the business? |
| Sprint 6 | What is happening inside the business? |
| Sprint 7 | How does the platform act automatically? |
| Sprint 8 | How does the platform adapt and recover? |

---

# Current Limitations

Current development is focused on strengthening production readiness.

Remaining work includes:

- Production Scheduler
- Rate Limiting
- Timezone Support
- Customer Self-Service Rescheduling
- Calendar Synchronization

---

# Founder

**Raghavendra Singh**

Computer Science Engineering Student passionate about building software that solves real-world operational problems through clean architecture, scalable systems, and thoughtful product design.

Schedulr is part of a broader vision of building practical software products that help businesses operate more efficiently through automation, operational intelligence, and reliable engineering.

---

# Contributing

Contributions are welcome.

1. Fork the repository.

2. Create a feature branch.

3. Commit your changes.

4. Push your branch.

5. Open a Pull Request.

Please follow the existing architecture, coding standards, and documentation style.

---

# License

Licensed under the **MIT License**.

See the `LICENSE` file for more information.