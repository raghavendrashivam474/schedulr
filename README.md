# Schedulr

> **Schedulr helps service-based businesses manage appointments through a simple, reliable online booking platform—reducing administrative work while making it easier for customers to schedule services.**

---

## The Problem

Many small and growing service businesses still manage appointments through phone calls, WhatsApp chats, paper diaries, spreadsheets, or social media messages. As bookings increase, these fragmented methods become difficult to manage, leading to scheduling conflicts, missed appointments, excessive back-and-forth communication, and poor customer experience.

Appointment management should be organized, transparent, and effortless—not another daily administrative burden.

---

## What Schedulr Does

Schedulr provides a centralized appointment management platform designed for businesses where **time is the primary resource**.

With Schedulr, businesses can:

* Manage business availability from a single place.
* Offer customers real-time appointment booking.
* Automatically generate available booking slots.
* Handle cancellations and rescheduling with minimal effort.
* Reduce manual scheduling and reminder management.
* Maintain an organized history of appointments and customers.
* Support multiple staff members under a single business.
* Grow from individual professionals to multi-staff businesses without changing workflows.

---

## Who Is It For?

Schedulr is designed for appointment-based service businesses, including:

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

If your business depends on scheduled appointments, Schedulr is built for you.

---

## See It In Action

🚧 Screenshots coming soon.

Future updates will include:

* Booking page
* Business dashboard
* Calendar view
* Appointment workflow
* Mobile experience

**Live Demo**

Coming soon.

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
git clone https://github.com/your-username/schedulr.git

cd schedulr

npm install
```

Create a local environment file.

```bash
cp .env.example .env
```

Update the required environment variables.

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

Although Schedulr focuses on solving scheduling problems, it is built using a production-oriented architecture designed for long-term scalability.

## Technology Stack

| Layer      | Technology              | Why                                                           |
| ---------- | ----------------------- | ------------------------------------------------------------- |
| Framework  | Next.js 14 (App Router) | Modern full-stack framework with server rendering and routing |
| Language   | TypeScript              | Strong type safety and maintainability                        |
| Styling    | Tailwind CSS            | Rapid, consistent UI development                              |
| Database   | PostgreSQL              | Reliable relational data for scheduling workflows             |
| ORM        | Prisma                  | Type-safe database access and schema management               |
| Validation | Zod                     | Runtime validation for reliable APIs                          |
| Formatting | Prettier                | Consistent code formatting                                    |
| Linting    | ESLint                  | Maintainable and standardized code quality                    |

---

## Project Structure

```text
schedulr/
│
├── src/
│   ├── app/
│   ├── components/
│   ├── features/
│   ├── hooks/
│   ├── services/
│   ├── config/
│   ├── middleware/
│   ├── types/
│   └── utils/
│
├── lib/
├── prisma/
├── docs/
├── tests/
└── public/
```

The project follows a **domain-driven structure**, where business capabilities are organized into independent modules rather than grouped solely by technical concerns.

---

## Key Design Decisions

* **Availability-first architecture** — Business availability is treated as the source of truth, from which bookable slots are generated.
* **Modular domain structure** — Business capabilities such as Booking, Availability, Services, and Customers remain independent and maintainable.
* **Event-driven workflow** — Notifications, analytics, and future integrations react to booking events instead of being tightly coupled.
* **Scalable by design** — The architecture is prepared for future support of multiple businesses, staff members, and locations.

---

# Product Roadmap

## Completed

* [x] Project foundation
* [x] Repository initialization
* [x] Development environment setup
* [x] PostgreSQL integration
* [x] Prisma ORM configuration
* [x] Documentation and project structure

---

## Planned

* [ ] Business onboarding
* [ ] Authentication & authorization
* [ ] Availability management
* [ ] Service management
* [ ] Appointment booking
* [ ] Calendar interface
* [ ] Customer self-service portal
* [ ] Email reminders
* [ ] Multi-staff scheduling
* [ ] Analytics dashboard
* [ ] Mobile-first experience

---

# Contributing

Contributions are welcome.

If you'd like to contribute:

1. Fork the repository.
2. Create a feature branch.

```bash
git checkout -b feature/your-feature
```

3. Commit your changes.

```bash
git commit -m "feat: add your feature"
```

4. Push the branch.

```bash
git push origin feature/your-feature
```

5. Open a Pull Request.

Please follow the existing project structure, coding standards, and documentation guidelines.

---

# Author

**Raghavendra Singh**

Computer Science Engineering Student

Building thoughtful software products that solve real-world problems through clean architecture, scalable systems, and user-centered design.

---

## License & Usage

This project is licensed under the **MIT License**.

You are free to:

* Use the software for personal and commercial purposes.
* Modify and extend the source code.
* Distribute original or modified versions.
* Incorporate the project into your own work.

The only requirement is that the original copyright and license notice remain included in all copies or substantial portions of the software.

See the **LICENSE** file for the complete license text.
