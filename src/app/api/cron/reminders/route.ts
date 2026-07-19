import { type NextRequest } from 'next/server'
import { successResponse, errorResponse, serverErrorResponse } from '@utils/api'
import { InMemoryQueue } from '@platform/jobs/queue/InMemoryQueue'
import { JobDispatcher } from '@platform/jobs/scheduler/JobDispatcher'
import { JobWorker } from '@platform/jobs/scheduler/JobWorker'
import { ReminderHandler } from '@platform/jobs/handlers/ReminderHandler'
import { CalendarHandler } from '@platform/jobs/handlers/CalendarHandler'
import { CleanupHandler } from '@platform/jobs/handlers/CleanupHandler'
import { findDueReminderIds } from '@features/reminders/services/reminder-processor.service'

export async function POST(request: NextRequest) {
  try {
    const authHeader = request.headers.get('authorization')
    const expected = process.env.REMINDER_CRON_SECRET

    if (!expected) {
      console.error('[CRON_REMINDERS] REMINDER_CRON_SECRET not configured')
      return errorResponse('Server not configured', 500)
    }

    if (authHeader !== 'Bearer ' + expected) {
      return errorResponse('Unauthorized', 401)
    }

    const now = new Date()
    const queue = new InMemoryQueue()
    const dispatcher = new JobDispatcher()

    dispatcher.register(new ReminderHandler())
    dispatcher.register(new CalendarHandler())
    dispatcher.register(new CleanupHandler())

    const worker = new JobWorker(queue, dispatcher)

    const dueIds = await findDueReminderIds(now)

    for (const reminderId of dueIds) {
      await queue.enqueue({
        type: 'REMINDER',
        payload: { reminderId },
        scheduledFor: now,
        priority: 'NORMAL',
        maxAttempts: 3,
      })
    }

    const result = await worker.run(now)
    console.log('[CRON_REMINDERS]', result)
    return successResponse(result, 'Reminder processing completed')
  } catch (error) {
    console.error('[CRON_REMINDERS]', error)
    return serverErrorResponse()
  }
}

export async function GET(request: NextRequest) {
  return POST(request)
}
