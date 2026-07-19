// ICalendarEvent
// Represents an event the platform wants to create, update, or delete.
// No provider-specific fields.
// No Google Calendar fields.
// No Outlook fields.
// Only what the platform cares about.

export interface ICalendarEvent {
  id?: string
  title: string
  description?: string
  startUtc: Date
  endUtc: Date
  timezone: string
  organizerEmail: string
  attendeeEmail: string
  attendeeName: string
  location?: string
  metadata?: Record<string, string>
}
