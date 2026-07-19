// InternalCalendarAdapter
// The default adapter. Stores calendar events internally.
// No Google. No Outlook. No external API calls.
// Future adapters will implement ICalendarAdapter and slot in here.

import type { ICalendarAdapter } from '../../interfaces'
import type { ICalendarEvent, ICalendarResult } from '../../interfaces'

export class InternalCalendarAdapter implements ICalendarAdapter {
  readonly provider = 'INTERNAL'

  async createEvent(event: ICalendarEvent): Promise<ICalendarResult> {
    try {
      // Internal storage only for now.
      // Future: persist to a CalendarEvent table.
      console.log(
        `[InternalCalendar] Creating event: ${event.title} at ${event.startUtc.toISOString()}`
      )
      return {
        success: true,
        provider: this.provider,
        externalEventId: `internal_${Date.now()}`,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async updateEvent(eventId: string, event: ICalendarEvent): Promise<ICalendarResult> {
    try {
      console.log(
        `[InternalCalendar] Updating event: ${eventId} -> ${event.title}`
      )
      return {
        success: true,
        provider: this.provider,
        externalEventId: eventId,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async deleteEvent(eventId: string): Promise<ICalendarResult> {
    try {
      console.log(`[InternalCalendar] Deleting event: ${eventId}`)
      return {
        success: true,
        provider: this.provider,
        externalEventId: eventId,
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async isHealthy(): Promise<boolean> {
    return true
  }
}
