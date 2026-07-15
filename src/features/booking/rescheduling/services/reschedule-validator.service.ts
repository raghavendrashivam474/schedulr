import { prisma } from '@lib/prisma'
import { checkBusinessAvailability, timeToMinutes, minutesToTime } from '@features/booking/engine/availability.engine'
import type { RescheduleValidationResult } from '../types'

export async function validateReschedule(input: {
  bookingId: string
  businessId: string
  newAppointmentDate: string
  newStartTime: string
}): Promise<RescheduleValidationResult> {
  const { bookingId, businessId, newAppointmentDate, newStartTime } = input

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId },
    include: { service: true },
  })

  if (!booking) {
    return { valid: false, reason: 'APPOINTMENT_NOT_FOUND', message: 'Appointment not found' }
  }

  const rescheduableStatuses = ['CONFIRMED', 'CHECKED_IN']
  if (!rescheduableStatuses.includes(booking.status)) {
    return { valid: false, reason: 'APPOINTMENT_NOT_RESCHEDULABLE', message: 'Cannot reschedule an appointment in status ' + booking.status }
  }

  if (!/^\d{4}-\d{2}-\d{2}$/.test(newAppointmentDate)) {
    return { valid: false, reason: 'INVALID_START_TIME', message: 'Date must be YYYY-MM-DD' }
  }
  if (!/^([01]\d|2[0-3]):([0-5]\d)$/.test(newStartTime)) {
    return { valid: false, reason: 'INVALID_START_TIME', message: 'Time must be HH:MM' }
  }

  const currentDateStr = booking.appointmentDate.toISOString().split('T')[0]
  if (currentDateStr === newAppointmentDate && booking.startTime === newStartTime) {
    return { valid: false, reason: 'NO_OP', message: 'Requested time equals current appointment time' }
  }

  const requestDate = new Date(newAppointmentDate + 'T00:00:00')
  const availability = await checkBusinessAvailability(businessId, requestDate)
  if (!availability.isAvailable) {
    const reason = availability.reason ?? 'Business is not available'
    if (reason.toLowerCase().includes('closed on this date')) {
      return { valid: false, reason: 'HOLIDAY', message: reason }
    }
    if (reason.toLowerCase().includes('closed on this day')) {
      return { valid: false, reason: 'OUTSIDE_BUSINESS_HOURS', message: reason }
    }
    return { valid: false, reason: 'BUSINESS_UNAVAILABLE', message: reason }
  }

  const startMinutes = timeToMinutes(newStartTime)
  const endMinutes = startMinutes + booking.service.duration
  const newEndTime = minutesToTime(endMinutes)

  if (availability.window) {
    const openM = timeToMinutes(availability.window.openTime)
    const closeM = timeToMinutes(availability.window.closeTime)
    if (startMinutes < openM || endMinutes > closeM) {
      return { valid: false, reason: 'OUTSIDE_BUSINESS_HOURS', message: 'Requested time is outside business hours' }
    }
    const inBreak = availability.window.breaks.some((b) => {
      const bs = timeToMinutes(b.startTime)
      const be = timeToMinutes(b.endTime)
      return startMinutes < be && endMinutes > bs
    })
    if (inBreak) {
      return { valid: false, reason: 'BREAK_CONFLICT', message: 'Requested time falls within a break period' }
    }
  }

  const business = await prisma.business.findUnique({ where: { id: businessId } })
  if (business) {
    const advanceMinutes = business.advanceBookingHours * 60
    const now = new Date()
    const requestDateTime = new Date(newAppointmentDate + 'T' + newStartTime + ':00')
    const diffMinutes = (requestDateTime.getTime() - now.getTime()) / 60000
    if (diffMinutes < advanceMinutes) {
      return { valid: false, reason: 'BOOKING_POLICY_VIOLATION', message: 'Requires at least ' + business.advanceBookingHours + ' hours advance notice' }
    }
  }

  const dateStart = new Date(newAppointmentDate + 'T00:00:00')
  const dateEnd = new Date(newAppointmentDate + 'T23:59:59')

  const conflict = await prisma.booking.findFirst({
    where: {
      businessId,
      id: { not: bookingId },
      appointmentDate: { gte: dateStart, lte: dateEnd },
      status: { in: ['CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS'] },
      OR: [
        { startTime: { lte: newStartTime }, endTime: { gt: newStartTime } },
        { startTime: { lt: newEndTime }, endTime: { gte: newEndTime } },
        { startTime: { gte: newStartTime }, endTime: { lte: newEndTime } },
      ],
    },
  })

  if (conflict) {
    return { valid: false, reason: 'APPOINTMENT_CONFLICT', message: 'This time conflicts with an existing appointment' }
  }

  return { valid: true }
}
