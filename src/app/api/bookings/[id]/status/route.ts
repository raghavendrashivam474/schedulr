import { type NextRequest } from 'next/server'
import { transitionBookingStatus } from '@features/booking/lifecycle/lifecycle.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'
import type { BookingStatus } from '@appTypes/index'

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const body = await request.json()
    const { status, note } = body as { status: BookingStatus; note?: string }
    const result = await transitionBookingStatus(id, user.id, status, note)
    return successResponse({ booking: result }, 'Status updated successfully')
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 400)
    }
    console.error('[TRANSITION_STATUS]', error)
    return serverErrorResponse()
  }
}
