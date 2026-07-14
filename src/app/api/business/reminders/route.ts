import { type NextRequest } from 'next/server'
import { getReminderPolicy, updateReminderPolicy } from '@features/reminders/services/reminder-policy.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { prisma } from '@lib/prisma'
import { successResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
    })
    if (!membership) return successResponse({ policy: { reminder24h: true, reminder2h: true, reminder30m: false } })

    const policy = await getReminderPolicy(membership.businessId)
    return successResponse({ policy })
  } catch (error) {
    console.error('[GET_REMINDER_POLICY]', error)
    return serverErrorResponse()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const body = await request.json()
    const policy = await updateReminderPolicy(user.id, {
      reminder24h: body.reminder24h,
      reminder2h: body.reminder2h,
      reminder30m: body.reminder30m,
    })

    return successResponse({ policy }, 'Reminder settings updated')
  } catch (error) {
    console.error('[UPDATE_REMINDER_POLICY]', error)
    return serverErrorResponse()
  }
}
