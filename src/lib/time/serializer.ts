// Serializer helpers that convert stored UTC values into business-timezone display strings.
// Every API response that includes timestamps should use these helpers to render display fields.

import { formatInBusinessTime, utcToBusinessTime } from '@lib/time'

export interface BusinessTimestamps {
  utc: string
  businessDate: string
  businessTime: string
  businessDateTime: string
  timezone: string
}

export function serializeBusinessTimestamp(
  utcDate: Date,
  timezone: string
): BusinessTimestamps {
  return {
    utc: utcDate.toISOString(),
    businessDate: formatInBusinessTime(utcDate, timezone, 'yyyy-MM-dd'),
    businessTime: formatInBusinessTime(utcDate, timezone, 'HH:mm'),
    businessDateTime: formatInBusinessTime(utcDate, timezone, 'yyyy-MM-dd HH:mm'),
    timezone,
  }
}

// Return a UTC Date shifted to represent the same wall-clock time in the business timezone.
// Useful when a downstream serializer expects a Date object.
export function toBusinessDate(utcDate: Date, timezone: string): Date {
  return utcToBusinessTime(utcDate, timezone)
}
