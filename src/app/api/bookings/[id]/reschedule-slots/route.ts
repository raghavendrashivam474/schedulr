import { type NextRequest } from 'next/server'
import { prisma } from '@lib/prisma'
import { checkBusinessAvailability, timeToMinutes, minutesToTime } from '@features/booking/engine/availability.engine'
import { generateSlots } from '@features/booking/engine/slot.generator'
import { getAuthenticatedUser } from '@utils/auth-context'
import { successResponse, errorResponse, unauthorizedResponse, notFoundResponse, serverErrorResponse } from '@utils/api'

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const user = await getAuthenticatedUser()
    if (!user) return unauthorizedResponse()

    const { id } = await params
    const date = request.nextUrl.searchParams.get('date')
    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return errorResponse('Invalid date. Use YYYY-MM-DD', 400)
    }

    const membership = await prisma.membership.findFirst({
      where: { userId: user.id, status: 'ACTIVE' },
    })
    if (!membership) return notFoundResponse('Business')

    const booking = await prisma.booking.findFirst({
      where: { id, businessId: membership.businessId },
      include: { service: true },
    })
    if (!booking) return notFoundResponse('Booking')

    const requestDate = new Date(date + 'T00:00:00')
    const availability = await checkBusinessAvailability(booking.businessId, requestDate)
    if (!availability.isAvailable || !availability.window) {
      return successResponse({ slots: [] })
    }

    const business = await prisma.business.findUnique({
      where: { id: booking.businessId },
    })
    if (!business) return notFoundResponse('Business')

    const dateStart = new Date(date + 'T00:00:00')
    const dateEnd = new Date(date + 'T23:59:59')

    const existingBookings = await prisma.booking.findMany({
      where: {
        businessId: booking.businessId,
        id: { not: id },
        appointmentDate: { gte: dateStart, lte: dateEnd },
        status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'] },
      },
      select: { startTime: true, endTime: true },
    })

    const now = new Date()
    const isToday = requestDate.toDateString() === now.toDateString()
    const currentTimeMinutes = isToday ? now.getHours() * 60 + now.getMinutes() : 0

    const slots = generateSlots({
      openTime: availability.window.openTime,
      closeTime: availability.window.closeTime,
      duration: booking.service.duration,
      breaks: availability.window.breaks,
      existingBookings,
      advanceBookingMinutes: business.advanceBookingHours * 60,
      isToday,
      currentTimeMinutes,
    })

    // Unused variables from helpers (kept to preserve API surface)
    void timeToMinutes
    void minutesToTime

    return successResponse({ slots })
  } catch (error) {
    console.error('[RESCHEDULE_SLOTS]', error)
    return serverErrorResponse()
  }
}
