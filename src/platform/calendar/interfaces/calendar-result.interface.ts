// ICalendarResult
// Every adapter returns this after an attempted operation.
// The CalendarService uses this to track synchronization state.

export interface ICalendarResult {
  success: boolean
  provider: string
  externalEventId?: string
  failureReason?: string
  retryable?: boolean
}
