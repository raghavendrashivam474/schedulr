import { prisma } from '@lib/prisma'
import { timeToMinutes, minutesToTime } from '@features/booking/engine/availability.engine'
import { validateReschedule } from './reschedule-validator.service'
import { resyncRemindersForBooking } from '@features/reminders/services/reminder-sync.service'
import type { RescheduleValidationResult } from '../types'
import type { Booking } from '@appTypes/index'

export interface RescheduleResult {
  success: boolean
  booking?: Booking
  validation?: RescheduleValidationResult
  error?: string
  reminderResyncFailed?: boolean
}

export async function rescheduleAppointment(input: {
  userId: string
  bookingId: string
  newAppointmentDate: string
  newStartTime: string
  reason?: string
}): Promise<RescheduleResult> {
  const membership = await prisma.membership.findFirst({
    where: { userId: input.userId, status: 'ACTIVE' },
  })
  if (!membership) return { success: false, error: 'Business not found' }

  const businessId = membership.businessId

  const validation = await validateReschedule({
    bookingId: input.bookingId,
    businessId,
    newAppointmentDate: input.newAppointmentDate,
    newStartTime: input.newStartTime,
  })

  if (!validation.valid) {
    return { success: false, validation }
  }

  const existing = await prisma.booking.findFirst({
    where: { id: input.bookingId, businessId },
    include: { service: true },
  })
  if (!existing) {
    return { success: false, error: 'Appointment not found' }
  }

  const oldAppointmentDate = existing.appointmentDate
  const oldStartTime = existing.startTime
  const oldEndTime = existing.endTime

  const newStartMin = timeToMinutes(input.newStartTime)
  const newEndMin = newStartMin + existing.service.duration
  const newEndTime = minutesToTime(newEndMin)
  const newAppointmentDateObj = new Date(input.newAppointmentDate + 'T00:00:00')

  let updated
  try {
    updated = await prisma.$transaction(async (tx) => {
      const updatedBooking = await tx.booking.update({
        where: { id: input.bookingId },
        data: {
          appointmentDate: newAppointmentDateObj,
          startTime: input.newStartTime,
          endTime: newEndTime,
        },
      })

      await tx.appointmentChange.create({
        data: {
          bookingId: input.bookingId,
          type: 'RESCHEDULED',
          oldAppointmentDate,
          oldStartTime,
          oldEndTime,
          newAppointmentDate: newAppointmentDateObj,
          newStartTime: input.newStartTime,
          newEndTime,
          reason: input.reason ?? null,
          changedByUserId: input.userId,
        },
      })

      return updatedBooking
    })
  } catch (error) {
    console.error('[RESCHEDULE_TRANSACTION_FAILED]', error)
    return { success: false, error: 'Failed to reschedule appointment' }
  }

  // Reminder resynchronization occurs after the appointment transaction commits.
  // Rationale: appointment update and change history are one business event;
  // reminder future work is derived state that we reconcile immediately after,
  // but a reminder failure must not roll back the appointment change.
  let reminderResyncFailed = false
  try {
    await resyncRemindersForBooking(input.bookingId)
  } catch (error) {
    console.error('[RESCHEDULE_REMINDER_RESYNC_FAILED]', {
      bookingId: input.bookingId,
      error: error instanceof Error ? error.message : 'unknown',
    })
    reminderResyncFailed = true
  }

  return {
    success: true,
    booking: updated as unknown as Booking,
    ...(reminderResyncFailed && { reminderResyncFailed: true }),
  }
}
