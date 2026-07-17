import { type NextRequest } from 'next/server'
import { z } from 'zod'
import { rescheduleAppointment } from '@features/booking/rescheduling/services/reschedule.service'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, validationErrorResponse, unauthorizedResponse, serverErrorResponse } from '@utils/api'

const rescheduleSchema = z.object({
  newAppointmentDate: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be YYYY-MM-DD'),
  newStartTime: z.string().regex(/^([01]\d|2[0-3]):([0-5]\d)$/, 'Time must be HH:MM'),
  reason: z.string().max(500).optional(),
})

export async function POST(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const { id } = await params
    const body = await request.json()
    const parsed = rescheduleSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [k, v ?? []])
      )
      return validationErrorResponse(details)
    }

    const result = await rescheduleAppointment({
      userId: user.id,
      bookingId: id,
      newAppointmentDate: parsed.data.newAppointmentDate,
      newStartTime: parsed.data.newStartTime,
      reason: parsed.data.reason,
    })

    if (!result.success) {
      if (result.validation && !result.validation.valid) {
        return errorResponse(result.validation.message, 409, { reason: [result.validation.reason] })
      }
      return errorResponse(result.error ?? 'Failed to reschedule', 400)
    }

    return successResponse(
      { booking: result.booking, reminderResyncFailed: result.reminderResyncFailed ?? false },
      'Appointment rescheduled successfully'
    )
  } catch (error) {
    console.error('[RESCHEDULE_API]', error)
    return serverErrorResponse()
  }
}
