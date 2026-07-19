import type {
  PlannedReminder,
  ReminderPolicy,
  ReminderInterval,
} from '../types'
import { REMINDER_INTERVALS } from '../types'
import { combineBusinessDateTimeToUTC, nowUTC } from '@lib/time'

function isIntervalEnabled(policy: ReminderPolicy, key: ReminderInterval): boolean {
  if (key === 'REMINDER_24H') return policy.reminder24h
  if (key === 'REMINDER_2H') return policy.reminder2h
  if (key === 'REMINDER_30M') return policy.reminder30m
  return false
}

// Timezone-aware planner.
// Computes reminder scheduledFor as UTC based on the business timezone.
export function planReminders(
  appointmentDateTime: Date,
  policy: ReminderPolicy,
  now: Date = new Date()
): PlannedReminder[] {
  const planned: PlannedReminder[] = []

  for (const interval of REMINDER_INTERVALS) {
    if (!isIntervalEnabled(policy, interval.key)) continue

    const scheduledFor = new Date(
      appointmentDateTime.getTime() - interval.minutesBefore * 60 * 1000
    )

    if (scheduledFor <= now) continue

    planned.push({
      intervalKey: interval.key,
      scheduledFor,
      channel: 'EMAIL',
    })
  }

  return planned
}

// Legacy helper - server local time combination.
// Kept for backwards compatibility with code that predates timezone support.
export function combineAppointmentDateTime(appointmentDate: Date, startTime: string): Date {
  const [hours, minutes] = startTime.split(':').map(Number)
  const combined = new Date(appointmentDate)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}

// Timezone-aware combination.
// Prefer this for all new code paths.
export function combineAppointmentDateTimeUTC(
  appointmentDate: Date,
  startTime: string,
  businessTimezone: string
): Date {
  const dateStr = appointmentDate.toISOString().split('T')[0]
  return combineBusinessDateTimeToUTC(dateStr, startTime, businessTimezone)
}

export function currentUTC(): Date {
  return nowUTC()
}
