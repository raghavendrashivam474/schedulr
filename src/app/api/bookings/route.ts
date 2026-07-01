import { type NextRequest } from 'next/server'
import { createBookingSchema } from '@features/booking/validation'
import { createBooking, getBookings } from '@features/booking/services/booking.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import {
  successResponse, errorResponse, validationErrorResponse,
  unauthorizedResponse, serverErrorResponse,
} from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const { searchParams } = new URL(request.url)
    const status = searchParams.get('status') ?? undefined
    const date = searchParams.get('date') ?? undefined

    const bookings = await getBookings(user.id, { status, date })
    return successResponse({ bookings })
  } catch (error) {
    console.error('[GET_BOOKINGS]', error)
    return serverErrorResponse()
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const parsed = createBookingSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }

    const booking = await createBooking(parsed.data)
    return successResponse({ booking }, 'Booking confirmed successfully', 201)
  } catch (error) {
    if (error instanceof Error) {
      return errorResponse(error.message, 409)
    }
    console.error('[CREATE_BOOKING]', error)
    return serverErrorResponse()
  }
}
