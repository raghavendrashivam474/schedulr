// Timezone utilities - central IANA timezone validation and constants

export const DEFAULT_TIMEZONE = 'UTC'

// A curated list of common timezones for validation and UI display.
// The Intl API validates any IANA timezone; this list is for display convenience.
export const SUPPORTED_TIMEZONES = [
  'UTC',
  'Europe/London',
  'Europe/Paris',
  'Europe/Berlin',
  'America/New_York',
  'America/Chicago',
  'America/Denver',
  'America/Los_Angeles',
  'Asia/Dubai',
  'Asia/Kolkata',
  'Asia/Singapore',
  'Asia/Tokyo',
  'Australia/Sydney',
] as const

export function isValidTimezone(timezone: string): boolean {
  if (!timezone || typeof timezone !== 'string') return false
  try {
    new Intl.DateTimeFormat('en-US', { timeZone: timezone })
    return true
  } catch {
    return false
  }
}

export function normalizeTimezone(timezone: string | null | undefined): string {
  if (!timezone) return DEFAULT_TIMEZONE
  return isValidTimezone(timezone) ? timezone : DEFAULT_TIMEZONE
}
