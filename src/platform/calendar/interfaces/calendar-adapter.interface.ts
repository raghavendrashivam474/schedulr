// ICalendarAdapter
// Every calendar provider must implement this interface.
// The CalendarService only knows this contract.
// It never knows whether it is talking to Google, Outlook, or Apple.

import type { ICalendarEvent } from './calendar-event.interface'
import type { ICalendarResult } from './calendar-result.interface'

export interface ICalendarAdapter {
  readonly provider: string
  createEvent(event: ICalendarEvent): Promise<ICalendarResult>
  updateEvent(eventId: string, event: ICalendarEvent): Promise<ICalendarResult>
  deleteEvent(eventId: string): Promise<ICalendarResult>
  isHealthy(): Promise<boolean>
}
