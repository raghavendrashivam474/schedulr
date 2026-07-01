import { type NextRequest } from 'next/server'
import { getSlotsSchema } from '@features/booking/validation'
import { getAvailableSlots } from '@features/booking/services/booking.service'
import { successResponse, validationErrorResponse, serverErrorResponse } from '@utils/api'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const parsed = getSlotsSchema.safeParse({
      businessId: searchParams.get('businessId'),
      serviceId: searchParams.get('serviceId'),
      date: searchParams.get('date'),
    })

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }

    const slots = await getAvailableSlots(parsed.data)
    return successResponse({ slots })
  } catch (error) {
    console.error('[GET_SLOTS]', error)
    return serverErrorResponse()
  }
}
