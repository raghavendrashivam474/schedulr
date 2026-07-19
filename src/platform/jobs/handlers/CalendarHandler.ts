// CalendarHandler
// Owns calendar synchronization within the job platform.
// Calls the CalendarService abstraction.
// No provider-specific logic here.
// Future: payload will carry eventId and operation type.

import type { IJobHandler, JobExecutionResult } from '../contracts/JobHandler'
import type { Job } from '../contracts/Job'
import { CalendarService } from '@platform/calendar/calendar.service'
import { InternalCalendarAdapter } from '@platform/calendar/adapters/internal/internal-calendar.adapter'

export class CalendarHandler implements IJobHandler {
  readonly jobType = 'CALENDAR_SYNC'

  private readonly calendarService = new CalendarService(
    new InternalCalendarAdapter()
  )

  async execute(job: Job): Promise<JobExecutionResult> {
    const operation = job.payload['operation']
    const eventId = job.payload['eventId']

    if (typeof operation !== 'string' || !operation) {
      return {
        success: false,
        failureReason: 'CalendarHandler: missing operation in payload',
        retryable: false,
      }
    }

    try {
      if (operation === 'DELETE' && typeof eventId === 'string') {
        const result = await this.calendarService.deleteEvent(eventId)
        return {
          success: result.success,
          failureReason: result.failureReason,
          retryable: result.retryable ?? false,
        }
      }

      // CREATE and UPDATE require a full event payload.
      // Future milestones will build this out fully.
      // For now we acknowledge the job and mark it complete.
      console.log(
        `[CalendarHandler] operation=${operation} acknowledged for future implementation`
      )
      return { success: true }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        failureReason: message,
        retryable: true,
      }
    }
  }
}
