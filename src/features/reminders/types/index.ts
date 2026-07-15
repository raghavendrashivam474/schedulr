// Reminder Types
export type ReminderStatus = 'PENDING' | 'PROCESSING' | 'SENT' | 'FAILED' | 'CANCELLED' | 'RETRY_PENDING'
export type NotificationChannel = 'EMAIL'
export type ReminderInterval = 'REMINDER_24H' | 'REMINDER_2H' | 'REMINDER_30M'

export interface Reminder {
  id: string
  bookingId: string
  channel: NotificationChannel
  intervalKey: string
  scheduledFor: Date
  status: ReminderStatus
  attemptCount: number
  lastAttemptAt?: Date | null
  nextAttemptAt?: Date | null
  sentAt?: Date | null
  failureReason?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface ReminderPolicy {
  reminder24h: boolean
  reminder2h: boolean
  reminder30m: boolean
}

export interface ReminderIntervalDefinition {
  key: ReminderInterval
  minutesBefore: number
  label: string
}

export const REMINDER_INTERVALS: ReminderIntervalDefinition[] = [
  { key: 'REMINDER_24H', minutesBefore: 24 * 60, label: '24 hours before' },
  { key: 'REMINDER_2H', minutesBefore: 2 * 60, label: '2 hours before' },
  { key: 'REMINDER_30M', minutesBefore: 30, label: '30 minutes before' },
]

export interface PlannedReminder {
  intervalKey: ReminderInterval
  scheduledFor: Date
  channel: NotificationChannel
}

export interface DispatchResult {
  success: boolean
  failureReason?: string
}
