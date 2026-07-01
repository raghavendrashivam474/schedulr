# Schedulr

> **Schedulr helps service-based businesses manage services, availability, and appointments through an intelligent scheduling platform that simplifies booking for both businesses and customers.**

---

## Project Status

🚧 **Active Development**

**Current Version:** v0.3.1

**Current Milestone:** Sprint 3 Complete

**Next Milestone:** Sprint 4 – Notifications & Customer Management

---

# The Problem

Many service-based businesses still manage appointments using phone calls, WhatsApp chats, paper diaries, spreadsheets, or social media messages.

As the number of customers grows, these disconnected workflows often result in:

* Double bookings
* Missed appointments
* Scheduling conflicts
* Manual follow-ups
* Poor customer experience
* Administrative overhead

Scheduling should help businesses operate efficiently—not consume valuable time.

---

# What Schedulr Does

Schedulr centralizes appointment management into a single platform designed for businesses where **time is the primary resource**.

Current capabilities include:

* Secure business onboarding
* Business profile management
* Service management
* Weekly schedule configuration
* Holiday management
* Business availability management
* Dynamic appointment slot generation
* Intelligent booking validation
* Public appointment booking
* Booking dashboard
* Appointment lifecycle management

The platform is designed to grow from a single professional to a multi-staff scheduling solution without architectural redesign.

---

# Who Is It For?

Schedulr is built for appointment-based businesses, including:

* Doctors and Clinics
* Tutors and Coaching Centers
* Salons and Spas
* Consultants
* Fitness Trainers
* Freelancers
* Legal Professionals
* Wellness Practitioners
* Repair Services
* Photography Studios

If your business relies on appointments, Schedulr is designed to support your workflow.

---

# Current Platform Capabilities

### Identity

* User authentication
* Session management
* Protected dashboard
* Business ownership

### Business Operations

* Service management
* Weekly schedules
* Holiday management
* Business settings
* Availability configuration

### Scheduling Intelligence

* Dynamic slot generation
* Availability engine
* Booking validation
* Public booking experience
* Booking management dashboard

---

# See It In Action

Current implementation includes:

* Business onboarding
* Service management
* Availability configuration
* Public booking page
* Dynamic slot generation
* Booking dashboard
* Appointment management

🚧 Screenshots and a live demo will be added in a future release.

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

Schedulr is built using a modular, production-oriented architecture focused on maintainability, scalability, and clean separation of responsibilities.

## Technology Stack

| Layer      | Technology           | Purpose                          |
| ---------- | -------------------- | -------------------------------- |
| Framework  | Next.js (App Router) | Full-stack application framework |
| Language   | TypeScript           | Type safety and maintainability  |
| Styling    | Tailwind CSS         | Consistent UI development        |
| Database   | PostgreSQL           | Relational data storage          |
| ORM        | Prisma               | Type-safe database access        |
| Validation | Zod                  | Runtime request validation       |
| Formatting | Prettier             | Consistent formatting            |
| Linting    | ESLint               | Code quality                     |

---

## Architecture Principles

Schedulr follows several core engineering principles.

### Availability-First Architecture

Business availability acts as the source of truth for all scheduling decisions.

### Dynamic Slot Generation

Appointment slots are generated dynamically on every request and are **never stored**, ensuring accuracy while avoiding synchronization problems.

### Double Booking Validation

Every booking request is validated twice:

* During slot generation
* Immediately before booking creation

This prevents race conditions and overlapping appointments.

### Domain-Driven Structure

Business capabilities remain isolated into independent modules, including:

* Authentication
* Business
* Services
* Availability
* Booking

This keeps the platform maintainable as new capabilities are introduced.

### Event-Oriented Growth

Future capabilities such as notifications, analytics, reminders, and customer history will react to booking events instead of tightly coupling business logic.

---

# Project Structure

```text
schedulr/

src/
├── app/
├── components/
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
* ✅ Authentication & session management
* ✅ Business onboarding
* ✅ Service management
* ✅ Weekly schedule configuration
* ✅ Holiday management
* ✅ Availability engine
* ✅ Dynamic slot generation
* ✅ Booking validation
* ✅ Public booking page
* ✅ Booking dashboard
* ✅ Appointment management

---

## Planned

* Email confirmations
* Customer management
* Appointment reminders
* Analytics dashboard
* Multi-staff scheduling
* Calendar synchronization
* Public business profiles
* Payment integration
* Mobile-first experience

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

Please follow the existing project architecture, coding standards, and documentation conventions.

---

# Author

**Raghavendra Singh**

Computer Science Engineering Student

Passionate about designing scalable software systems through clean architecture, thoughtful engineering, and user-centered product development.

GitHub:
https://github.com/raghavendrashivam474

---

# License

This project is licensed under the **MIT License**.

You are free to use, modify, and distribute this software in accordance with the terms of the MIT License.

See the **LICENSE** file for the complete license text.
