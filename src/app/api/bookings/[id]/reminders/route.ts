import { type NextRequest } from 'next/server'
import { getRemindersForBooking } from '@features/reminders/services/reminder-query.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const reminders = await getRemindersForBooking(user.id, id)
    return successResponse({ reminders })
  } catch (error) {
    console.error('[GET_BOOKING_REMINDERS]', error)
    return serverErrorResponse()
  }
}
