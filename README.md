# Schedulr

> **Schedulr helps service-based businesses manage their services, availability, customers, and appointments through an intelligent scheduling platform that makes discovering businesses and booking appointments simple, reliable, and professional.**

---

# Project Status

🚧 **Active Development**

**Current Version:** **v0.5.0**

**Current Milestone:** **Sprint 5 – Public Business Presence & Customer Discovery**

**Next Milestone:** **Sprint 6 – Business Insights & Operational Intelligence**

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

Customers also struggle to discover trustworthy businesses online or confidently book appointments without contacting the business first.

Appointment management should be organized, discoverable, and effortless—for both businesses and their customers.

---

# What Schedulr Does

Schedulr provides a centralized scheduling platform built for businesses where **time is the primary resource**.

Businesses can:

* Create and manage their business profile
* Offer multiple appointment-based services
* Configure weekly schedules and holidays
* Generate appointment slots dynamically
* Accept online bookings
* Manage appointments throughout their lifecycle
* Maintain customer records and booking history
* Build a professional public business profile
* Share booking links and QR codes
* Grow from individual professionals to larger service businesses without changing workflows

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

If your business depends on appointments, Schedulr is built for you.

---

# Current Platform Capabilities

## Identity & Business Foundation

* User authentication
* Session management
* Protected dashboard
* Business ownership
* Business onboarding

---

## Business Operations

* Service management
* Weekly schedules
* Holiday management
* Business availability
* Booking policies

---

## Scheduling Intelligence

* Dynamic slot generation
* Availability engine
* Intelligent booking validation
* Public booking experience
* Booking dashboard

---

## Appointment Lifecycle

* Customer management
* Automatic customer creation
* Appointment lifecycle management
* Appointment timeline
* Email notification service

---

## Public Business Presence

* Unique business slug
* Public business profile
* Business branding
* Social links
* Business description
* Share center
* QR code generation
* Public booking entry

---

# Customer Journey

Every booking now follows a simple, customer-focused experience.

```text
Discover Business
        │
        ▼
Visit Public Profile
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

Businesses can configure, operate, and grow from a single platform.

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
Publish Business Profile
        │
        ▼
Share Booking Link
        │
        ▼
Receive Bookings
        │
        ▼
Manage Customers & Appointments
```

---

# See It In Action

Current implementation includes:

* Business onboarding
* Service management
* Availability configuration
* Public business profiles
* Public booking pages
* Dynamic slot generation
* Appointment management
* Customer management
* Share center
* QR code generation

🚧 Screenshots, GIFs, and live demo will be added in future releases.

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

Schedulr is designed using a modular, domain-driven architecture focused on scalability, maintainability, and long-term product evolution.

---

## Technology Stack

| Layer      | Technology           | Purpose                          |
| ---------- | -------------------- | -------------------------------- |
| Framework  | Next.js (App Router) | Full-stack application framework |
| Language   | TypeScript           | Type safety                      |
| Styling    | Tailwind CSS         | Consistent UI development        |
| Database   | PostgreSQL           | Relational data storage          |
| ORM        | Prisma               | Type-safe database operations    |
| Validation | Zod                  | Runtime validation               |
| Formatting | Prettier             | Code consistency                 |
| Linting    | ESLint               | Code quality                     |

---

## Architecture Principles

### Availability-First Design

Business availability remains the source of truth for every scheduling decision.

---

### Dynamic Slot Generation

Appointment slots are computed on demand instead of being stored permanently.

This guarantees accurate availability while preventing synchronization issues.

---

### Double Booking Validation

Every booking is validated:

* During slot generation
* Immediately before persistence

This prevents concurrent booking conflicts.

---

### Domain-Driven Modules

The application is organized into independent business capabilities:

* Authentication
* Business
* Services
* Availability
* Booking
* Customers
* Appointment Lifecycle
* Public Profile
* Share Center

---

### Event-Oriented Growth

Future capabilities—including reminders, analytics, calendar integrations, payments, and external integrations—will react to domain events rather than introducing tight coupling between modules.

---

# Project Structure

```text
schedulr/

src/
├── app/
├── components/
├── config/
├── features/
├── hooks/
├── middleware/
├── services/
├── types/
├── utils/

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
* ✅ Authentication & authorization
* ✅ Business onboarding
* ✅ Service management
* ✅ Weekly schedules
* ✅ Holiday management
* ✅ Availability engine
* ✅ Dynamic slot generation
* ✅ Booking validation
* ✅ Public booking experience
* ✅ Appointment lifecycle
* ✅ Customer management
* ✅ Email notifications
* ✅ Public business profiles
* ✅ Business branding
* ✅ Share center
* ✅ QR code generation
* ✅ Business slug system

---

## Planned

* Business analytics
* Operational dashboard
* SEO optimization
* Appointment reminders
* Calendar synchronization
* Multi-staff scheduling
* File uploads
* Payment integration
* Mobile applications
* Public API
* Third-party integrations

---

# Roadmap

## Phase 1 — Core Platform ✅

* Project Foundation
* Identity
* Business Operations
* Scheduling Intelligence
* Appointment Lifecycle
* Public Business Presence

---

## Phase 2 — Business Productivity 🚧

* Business Insights
* Operational Intelligence
* Appointment Reminders
* Calendar Synchronization
* SEO
* File Uploads

---

## Phase 3 — Growth Platform

* Multi-staff scheduling
* Payment processing
* Public APIs
* Webhooks
* Marketplace integrations
* AI scheduling assistance

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

Please follow the existing architecture, coding standards, and documentation conventions.

---

# Author

**Raghavendra Singh**

Computer Science Engineering Student

Building scalable software products through clean architecture, thoughtful engineering, and user-centered design.

**GitHub**

https://github.com/raghavendrashivam474

---

# License

This project is licensed under the **MIT License**.

You are free to use, modify, distribute, and build upon this software in accordance with the MIT License.

See the **LICENSE** file for the complete license text.
