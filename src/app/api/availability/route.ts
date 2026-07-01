import { type NextRequest } from 'next/server'
import { holidaySchema } from '@features/availability/validation'
import { getHolidays, createHoliday } from '@features/availability/services/availability.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, errorResponse, validationErrorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function GET() {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const holidays = await getHolidays(user.id)
    return successResponse({ holidays })
  } catch (error) {
    console.error('[GET_AVAILABILITY]', error)
    return serverErrorResponse()
  }
}

export async function POST(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const body = await request.json()
    const parsed = holidaySchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const holiday = await createHoliday(user.id, parsed.data)
    return successResponse({ holiday }, 'Holiday added successfully', 201)
  } catch (error) {
    if (error instanceof Error && error.message.includes('already exists')) {
      return errorResponse(error.message, 409)
    }
    console.error('[CREATE_HOLIDAY]', error)
    return serverErrorResponse()
  }
}
