import type {
  PlannedReminder,
  ReminderPolicy,
  ReminderInterval,
} from '../types'
import { REMINDER_INTERVALS } from '../types'

function isIntervalEnabled(policy: ReminderPolicy, key: ReminderInterval): boolean {
  if (key === 'REMINDER_24H') return policy.reminder24h
  if (key === 'REMINDER_2H') return policy.reminder2h
  if (key === 'REMINDER_30M') return policy.reminder30m
  return false
}

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

export function combineAppointmentDateTime(appointmentDate: Date, startTime: string): Date {
  const [hours, minutes] = startTime.split(':').map(Number)
  const combined = new Date(appointmentDate)
  combined.setHours(hours, minutes, 0, 0)
  return combined
}
