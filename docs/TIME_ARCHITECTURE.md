# Time Architecture

**Sprint:** 9.1
**Status:** Foundation complete

## Principle

**Storage is UTC. Display is business timezone. Never the reverse.**

## Data Flow

```nClient submits: business-local date + time (e.g., '2026-08-01', '10:00')
     |
     v
API receives + validates timezone via Zod
     |
     v
Service layer converts to UTC via combineBusinessDateTimeToUTC()
     |
     v
Database stores UTC (Prisma DateTime = TIMESTAMP)
     |
     v
Reminders scheduled in UTC
     |
     v
Response serializer formats UTC back to business timezone for display
```n
## Core Modules

| File | Responsibility |
|---|---|
| `src/lib/time/timezone.ts` | IANA validation, normalization |
| `src/lib/time/time.service.ts` | UTC / business-time conversion |
| `src/lib/time/serializer.ts` | Response serialization helpers |
| `src/lib/validators/timezone.validator.ts` | Zod schema for API validation |

## Key Functions

### businessTimeToUTC(isoLocalString, timezone)
Convert an ISO local string in the business timezone into a UTC Date.

### combineBusinessDateTimeToUTC(dateStr, timeStr, timezone)
Combine a date and time in the business timezone and return a UTC Date.

### utcToBusinessTime(utcDate, timezone)
Convert a stored UTC Date into a Date shifted to the business timezone.

### formatInBusinessTime(utcDate, timezone, pattern)
Format a UTC Date as a display string in the business timezone.

### serializeBusinessTimestamp(utcDate, timezone)
Return a structured object with UTC, business date, business time, business datetime, and timezone.

## Rules for New Code

1. Never call `new Date(dateString)` for user input without converting through TimeService.
2. Never scatter timezone conversion inside route handlers or components.
3. Every business-facing timestamp response should go through `serializeBusinessTimestamp`.
4. Reminder scheduling must always use timezone-aware UTC combination.
5. Legacy helpers (`combineAppointmentDateTime` without timezone) exist for backwards compatibility. Prefer the `UTC` variants.

## Migration Path for Legacy Code

Existing bookings created before Sprint 9.1 stored timestamps as server-local time. New bookings use the timezone-aware path. A future data migration may re-normalize historical data if required.

## Verification

```bash
npm run test:time
```n
Expected: all timezone tests pass.

## Non-Goals (Sprint 9.1)

- Calendar integration (Google, Outlook)
- Multi-location per business
- Mobile client considerations
- DST edge case UI messaging

These will be enabled by this foundation but are out of scope for 9.1.
