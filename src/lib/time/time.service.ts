// TimeService - the single source of truth for all timezone conversions.
// Storage: UTC. Display: business timezone. Never the reverse.

import { fromZonedTime, toZonedTime, format as formatTz } from 'date-fns-tz'
import { normalizeTimezone } from './timezone'

// Convert a business-local time (year, month, day, hour, minute)
// into a UTC Date suitable for storage.
export function businessTimeToUTC(
  isoLocalString: string,
  timezone: string
): Date {
  const tz = normalizeTimezone(timezone)
  return fromZonedTime(isoLocalString, tz)
}

// Combine a date (YYYY-MM-DD) and time (HH:MM) in the business timezone
// and return the equivalent UTC Date.
export function combineBusinessDateTimeToUTC(
  dateStr: string,
  timeStr: string,
  timezone: string
): Date {
  const tz = normalizeTimezone(timezone)
  return fromZonedTime(dateStr + 'T' + timeStr + ':00', tz)
}

// Convert a UTC Date into a Date object that represents the same wall-clock
// time in the business timezone. Used for display formatting only.
export function utcToBusinessTime(utcDate: Date, timezone: string): Date {
  const tz = normalizeTimezone(timezone)
  return toZonedTime(utcDate, tz)
}

// Format a UTC Date into a business-timezone-aware display string.
export function formatInBusinessTime(
  utcDate: Date,
  timezone: string,
  pattern: string = 'yyyy-MM-dd HH:mm'
): string {
  const tz = normalizeTimezone(timezone)
  return formatTz(utcDate, pattern, { timeZone: tz })
}

// Return the current instant in UTC.
export function nowUTC(): Date {
  return new Date()
}

// Return today's date string (YYYY-MM-DD) as seen in the business timezone.
export function todayInBusinessTimezone(timezone: string): string {
  const tz = normalizeTimezone(timezone)
  return formatTz(new Date(), 'yyyy-MM-dd', { timeZone: tz })
}

// Start of a business day (00:00 local) returned as a UTC Date.
export function startOfBusinessDay(dateStr: string, timezone: string): Date {
  return combineBusinessDateTimeToUTC(dateStr, '00:00', timezone)
}

// End of a business day (23:59:59.999 local) returned as a UTC Date.
export function endOfBusinessDay(dateStr: string, timezone: string): Date {
  const tz = normalizeTimezone(timezone)
  const endLocal = fromZonedTime(dateStr + 'T23:59:59.999', tz)
  return endLocal
}

// Check whether two UTC Dates fall on the same day in the business timezone.
export function isSameBusinessDay(a: Date, b: Date, timezone: string): boolean {
  const tz = normalizeTimezone(timezone)
  return (
    formatTz(a, 'yyyy-MM-dd', { timeZone: tz }) ===
    formatTz(b, 'yyyy-MM-dd', { timeZone: tz })
  )
}
