import { type NextRequest } from 'next/server'
import { weeklyScheduleSchema } from '@features/availability/validation'
import { getWeeklySchedule, updateWeeklySchedule } from '@features/availability/services/availability.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, validationErrorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const schedules = await getWeeklySchedule(user.id)
    return successResponse({ schedules })
  } catch (error) {
    console.error('[GET_SCHEDULE]', error)
    return serverErrorResponse()
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const parsed = weeklyScheduleSchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const schedules = await updateWeeklySchedule(user.id, parsed.data)
    return successResponse({ schedules }, 'Schedule updated successfully')
  } catch (error) {
    console.error('[UPDATE_SCHEDULE]', error)
    return serverErrorResponse()
  }
}
