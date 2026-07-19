// Timezone-aware helpers for the booking engine.
// These sit alongside the existing availability engine and add UTC awareness.

import { combineBusinessDateTimeToUTC, nowUTC } from '@lib/time'

// Convert an appointment (business date + business start time + business timezone)
// into a UTC Date for accurate cross-timezone comparisons.
export function appointmentToUTC(
  appointmentDate: string,
  startTime: string,
  timezone: string
): Date {
  return combineBusinessDateTimeToUTC(appointmentDate, startTime, timezone)
}

// Check whether an appointment (in business time) is in the past.
export function isAppointmentInPastUTC(
  appointmentDate: string,
  startTime: string,
  timezone: string
): boolean {
  const utc = appointmentToUTC(appointmentDate, startTime, timezone)
  return utc.getTime() <= nowUTC().getTime()
}

// Calculate minutes between now (UTC) and an appointment (business time).
export function minutesUntilAppointment(
  appointmentDate: string,
  startTime: string,
  timezone: string
): number {
  const utc = appointmentToUTC(appointmentDate, startTime, timezone)
  return Math.floor((utc.getTime() - nowUTC().getTime()) / 60000)
}
