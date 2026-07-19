# Sprint 9.2
# Platform Services
# Senior → Junior Handover Document

---

# Before You Begin

This document has two phases.

**You must not begin Phase B until Phase A is complete.**

Phase A validates the existing foundation.
Phase B builds new capabilities on top of it.

If Phase A reveals architectural problems, stop immediately and report them.
Do not attempt to fix them silently.
Do not proceed to Phase B.

---

# Part I
# Validate Sprint 9.1

---

## Why This Exists

Sprint 9.2 depends entirely on Sprint 9.1 being correct.

Sprint 9.1 introduced the Time Foundation.
Every timestamp, timezone conversion, and reminder calculation
flows through that foundation.

If the foundation has a defect, anything built on top of it will also be defective.

Your first responsibility is to prove the foundation is sound.

Do not assume it is correct because tests pass.
Tests only prove what they test.
Architecture must be reviewed independently.

Spend the first 15 to 20 percent of this milestone on Part I.

---

## Architecture Review

Before touching any code, answer the following questions in writing.

Add your answers to a file called:

```

docs/validation/sprint-9.1-architecture-review.md

```

If you cannot answer a question, that is a red flag.
Read the source code until you can.

---

### Questions

**Timezone Storage**

Where is timezone stored?
At what layer?
In which model or schema field?
What format is it stored in?

---

**Conversion Ownership**

Which service owns timezone conversions?
Is conversion logic centralized or spread across multiple files?
If it is spread, that is an architectural defect. Report it.

---

**UTC Entry Point**

Where does UTC enter the system?
At what point is local time converted to UTC?
Is that conversion consistent across all entry points?

---

**UTC Exit Point**

Where does UTC leave the system?
At what point is UTC converted back to local time for display?
Is that conversion consistent?

---

**Conversion Boundaries**

Which components must never perform timezone conversions?
Are those boundaries currently respected in the codebase?

---

## Manual Verification

Run the application locally.

Perform each check in order.
Record the result as PASS or FAIL.

```

[ ] Create a business with timezone set to Asia/Kolkata
[ ] Create an appointment for that business
[ ] Verify the appointment is persisted in UTC
[ ] Verify the appointment is displayed in Asia/Kolkata local time
[ ] Verify reminder timestamps are calculated in UTC
[ ] Verify reminders are displayed in local time
[ ] Change the business timezone to America/New_York
[ ] Verify existing appointments still display correctly
[ ] Verify new reminders use the updated timezone
[ ] Run the full test suite
[ ] Verify the application builds without errors

```

If any check fails, stop here.
Report the failure before continuing.

---

## Automated Test Review

Run the test suite.

```powershell
npm test
```

Review the output.

Confirm the following:

```

[ ] All tests pass
[ ] No tests are skipped that should not be skipped
[ ] Test descriptions clearly reflect what is being tested
[ ] No test is passing for the wrong reason

```

If tests are passing but their descriptions do not match their assertions,
that is a quality defect. Report it.

---

## Regression Checklist

Verify that each feature area still works correctly.

```

Business Creation          [ ] PASS  [ ] FAIL
Appointment Creation       [ ] PASS  [ ] FAIL
Reminder Planning          [ ] PASS  [ ] FAIL
Reminder Retry             [ ] PASS  [ ] FAIL
Analytics                  [ ] PASS  [ ] FAIL
Booking Search             [ ] PASS  [ ] FAIL
Public Booking Flow        [ ] PASS  [ ] FAIL
Appointment History        [ ] PASS  [ ] FAIL
Rescheduling               [ ] PASS  [ ] FAIL
Reminder Synchronization   [ ] PASS  [ ] FAIL

```

---

## Acceptance Criteria

Sprint 9.1 is verified when all of the following are true.

```

[ ] Architecture questions answered and documented
[ ] Manual verification checklist complete with all PASS
[ ] Automated test suite passes with no unexpected skips
[ ] Regression checklist complete with all PASS
[ ] No architectural defects identified

```

---

## Phase A Gate

```

All checks PASS?

YES                        NO
↓                          ↓
Proceed to Part II         Stop
                           Document the failure
                           Report to senior developer
                           Do not continue

```

---

---

# Part II
# Implement Sprint 9.2

---

## Objective

Sprint 9.1 established how time works across the platform.

Sprint 9.2 establishes how communication and calendar synchronization work.

This milestone does not add user-facing features.
It adds platform infrastructure that future milestones will depend on.

The goal is abstraction, not implementation.

---

## Current Architecture

Today, reminders communicate directly with the email provider.

```

Reminder
↓
Email Provider

```

This is a direct dependency.
If the email provider changes, the reminder logic must change.
If a new channel is added, the reminder logic must change.
That coupling is the problem this milestone solves.

---

## Target Architecture

After Sprint 9.2, the platform should look like this.

```

Reminder
↓
Notification Service
↓
Provider Registry
↓
Email Provider
SMS Provider
WhatsApp Provider
Push Provider

```

And for calendar synchronization:

```

Appointment
↓
Calendar Service
↓
Calendar Adapter
↓
Google Calendar   (future)
Outlook           (future)
Apple Calendar    (future)

```

The platform no longer knows how notifications are delivered.
It only knows that a notification must be sent.

The platform no longer knows how calendars synchronize.
It only knows that an event must be created, updated, or deleted.

---

## Capabilities

---

### Notification Service

The Notification Service is a reusable interface.
It sits between business logic and delivery providers.

Responsibilities:

```

Provider selection
Sending
Retry signalling
Provider health
Delivery result

```

The Notification Service must not contain provider-specific logic.
Provider-specific logic belongs in the provider implementation.

---

### Calendar Service

The Calendar Service is a reusable interface.
It sits between appointment logic and calendar providers.

Responsibilities:

```

Create event
Update event
Delete event
Synchronization state

```

No Google Calendar code in this milestone.
No Outlook code in this milestone.
Only the abstraction.

---

### Provider Registry

The Provider Registry maps notification types to provider implementations.

```

Notification Service
↓
Provider Registry
↓
Email Provider
SMS Provider
WhatsApp Provider
Push Provider

```

Adding a new provider in the future must require no changes
to the Notification Service or to any business logic.

---

### Calendar Adapter

The Calendar Adapter maps calendar operations to provider implementations.

```

Calendar Service
↓
Calendar Adapter
↓
Google Calendar   (future)
Outlook           (future)
Apple Calendar    (future)

```

---

## Folder Structure

```

src/
  platform/
    notification/
      interfaces/
        notification.interface.ts
        provider.interface.ts
      registry/
        provider-registry.ts
      providers/
        email/
          email.provider.ts
      notification.service.ts
      notification.module.ts
    calendar/
      interfaces/
        calendar.interface.ts
        calendar-event.interface.ts
        calendar-adapter.interface.ts
      adapters/
        internal/
          internal-calendar.adapter.ts
      calendar.service.ts
      calendar.module.ts

```

---

## Implementation Order

Follow this order exactly.
Do not skip ahead.
Each step depends on the previous one being complete.

```

Step 1
Notification Interfaces
Define the contracts before writing any implementations.

↓

Step 2
Provider Registry
Build the registry that will hold provider implementations.

↓

Step 3
Email Provider Refactor
Migrate the existing email delivery to use the new notification abstraction.
The reminder behaviour must not change. Only the delivery path changes.

↓

Step 4
Calendar Interfaces
Define the calendar contracts before writing any implementations.

↓

Step 5
Internal Calendar Adapter
Build the internal adapter that implements the calendar interface.

↓

Step 6
Integration
Wire everything together. Verify end-to-end behaviour.

```

---

## Commit Plan

Each commit must be small and reviewable.
Each commit must leave the application in a working state.
Do not combine unrelated changes in a single commit.

---

### Commit 1

```

feat(notification): initialize notification abstraction

- Add INotification interface
- Add INotificationProvider interface
- Add INotificationResult interface
- No implementation yet

```

---

### Commit 2

```

feat(notification): add provider registry

- Add ProviderRegistry class
- Add provider registration
- Add provider resolution
- Add tests for registry logic

```

---

### Commit 3

```

refactor(reminders): migrate email delivery to notification service

- Add EmailProvider implementing INotificationProvider
- Wire EmailProvider through ProviderRegistry
- Update reminder delivery to use NotificationService
- Existing reminder behaviour must remain unchanged
- All existing tests must still pass

```

---

### Commit 4

```

feat(calendar): initialize calendar abstraction

- Add ICalendarEvent interface
- Add ICalendarAdapter interface
- Add ICalendarService interface
- No implementation yet

```

---

### Commit 5

```

feat(calendar): implement internal calendar service

- Add InternalCalendarAdapter implementing ICalendarAdapter
- Add CalendarService implementing ICalendarService
- Add tests for adapter and service

```

---

### Commit 6

```

test(platform): add notification and calendar tests

- Integration tests for notification flow
- Integration tests for calendar service
- Verify existing reminder tests still pass
- Verify build succeeds

```

---

### Commit 7

```

docs(platform): document platform services architecture

- Document notification service architecture
- Document calendar service architecture
- Document provider registry
- Document calendar adapter
- Update sprint validation record

```

---

## Testing Requirements

---

### Unit Tests

```

Notification interface contracts
Provider registry registration and resolution
Email provider sends correctly
Calendar interface contracts
Internal calendar adapter creates, updates, deletes events
Calendar service delegates correctly to adapter

```

---

### Integration Tests

```

Reminder triggers notification service
Notification service resolves correct provider
Provider delivers notification
Appointment creates calendar event through calendar service

```

---

### Regression Tests

Re-run the full regression checklist from Part I.

Every item that passed in Phase A must still pass.

```

Business Creation          [ ] PASS  [ ] FAIL
Appointment Creation       [ ] PASS  [ ] FAIL
Reminder Planning          [ ] PASS  [ ] FAIL
Reminder Retry             [ ] PASS  [ ] FAIL
Analytics                  [ ] PASS  [ ] FAIL
Booking Search             [ ] PASS  [ ] FAIL
Public Booking Flow        [ ] PASS  [ ] FAIL
Appointment History        [ ] PASS  [ ] FAIL
Rescheduling               [ ] PASS  [ ] FAIL
Reminder Synchronization   [ ] PASS  [ ] FAIL

```

---

## Deliverables

```

Notification abstraction (interfaces and service)
Provider registry
Email provider refactored to use notification abstraction
Calendar abstraction (interfaces and service)
Internal calendar adapter
Unit tests
Integration tests
Updated documentation
Release notes
Sprint validation record

```

---

## Definition of Done

The milestone is complete when every item below is true.

```

[ ] Existing reminder functionality is unchanged
[ ] Email is delivered through the new notification abstraction
[ ] Calendar abstraction exists with no provider-specific logic
[ ] Provider registry resolves providers correctly
[ ] All unit tests pass
[ ] All integration tests pass
[ ] Full regression checklist passes
[ ] Application build succeeds
[ ] Git history is clean with the seven commits above
[ ] Documentation is updated
[ ] Release notes are written
[ ] Sprint validation record is complete

```

---

## A Note on Scope

This milestone introduces no user-facing features.

A stakeholder reviewing the running application
will not see any difference from Sprint 9.1.

That is correct.

The value of this milestone is architectural.
It makes the next five milestones possible
without revisiting core business logic.

Resist the temptation to add Google Calendar integration now.
Resist the temptation to add SMS or WhatsApp now.

Those belong to future milestones.
Your job here is to build the foundation they will stand on.