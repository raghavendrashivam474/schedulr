import { type NextRequest } from 'next/server'
import { processDueReminders } from '@features/reminders/services/reminder-processor.service'
import { successResponse, errorResponse, serverErrorResponse } from '@utils/api'

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

    const result = await processDueReminders()
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
