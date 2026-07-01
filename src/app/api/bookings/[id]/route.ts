import { type NextRequest } from 'next/server'
import { updateBookingSchema } from '@features/booking/validation'
import { getBookingById, updateBookingStatus, cancelBooking } from '@features/booking/services/booking.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, errorResponse, validationErrorResponse,
  unauthorizedResponse, notFoundResponse, serverErrorResponse,
} from '@utils/api'

export async function GET(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const booking = await getBookingById(id, user.id)
    if (!booking) return notFoundResponse('Booking')
    return successResponse({ booking })
  } catch (error) {
    console.error('[GET_BOOKING]', error)
    return serverErrorResponse()
  }
}

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    const body = await request.json()
    const parsed = updateBookingSchema.safeParse(body)
    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }
    const booking = await updateBookingStatus(id, user.id, parsed.data)
    return successResponse({ booking }, 'Booking updated successfully')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) return notFoundResponse('Booking')
      return errorResponse(error.message, 400)
    }
    console.error('[UPDATE_BOOKING]', error)
    return serverErrorResponse()
  }
}

export async function DELETE(
  _request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()
    const { id } = await params
    await cancelBooking(id, user.id)
    return successResponse(null, 'Booking cancelled successfully')
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('not found')) return notFoundResponse('Booking')
      return errorResponse(error.message, 400)
    }
    console.error('[CANCEL_BOOKING]', error)
    return serverErrorResponse()
  }
}
