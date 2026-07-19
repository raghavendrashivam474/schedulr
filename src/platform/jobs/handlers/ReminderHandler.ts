// ReminderHandler
// Owns reminder delivery within the job platform.
// Calls the existing notification dispatcher directly.
// The worker never knows this is a reminder.

import type { IJobHandler, JobExecutionResult } from '../contracts/JobHandler'
import type { Job } from '../contracts/Job'
import { dispatchReminder } from '@features/reminders/dispatch/notification-dispatcher'

export class ReminderHandler implements IJobHandler {
  readonly jobType = 'REMINDER'

  async execute(job: Job): Promise<JobExecutionResult> {
    const reminderId = job.payload['reminderId']

    if (typeof reminderId !== 'string' || !reminderId) {
      return {
        success: false,
        failureReason: 'ReminderHandler: missing reminderId in payload',
        retryable: false,
      }
    }

    try {
      const result = await dispatchReminder(reminderId)
      return {
        success: result.success,
        failureReason: result.failureReason,
        retryable: true,
      }
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
