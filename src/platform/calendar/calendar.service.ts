// CalendarService
// The single entry point for all calendar operations.
// Appointment logic calls this. It never calls an adapter directly.
// Swap the adapter and nothing else in the platform changes.

import type { ICalendarAdapter, ICalendarEvent, ICalendarResult } from './interfaces'

export class CalendarService {
  constructor(private readonly adapter: ICalendarAdapter) {}

  async createEvent(event: ICalendarEvent): Promise<ICalendarResult> {
    try {
      return await this.adapter.createEvent(event)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.adapter.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async updateEvent(eventId: string, event: ICalendarEvent): Promise<ICalendarResult> {
    try {
      return await this.adapter.updateEvent(eventId, event)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.adapter.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async deleteEvent(eventId: string): Promise<ICalendarResult> {
    try {
      return await this.adapter.deleteEvent(eventId)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: this.adapter.provider,
        failureReason: message,
        retryable: false,
      }
    }
  }

  async isAdapterHealthy(): Promise<boolean> {
    return this.adapter.isHealthy()
  }

  activeProvider(): string {
    return this.adapter.provider
  }
}
