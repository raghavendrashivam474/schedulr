import { prisma } from '@lib/prisma'
import { planReminders, combineAppointmentDateTime } from '../engines/reminder-planning.engine'
import { getReminderPolicy } from './reminder-policy.service'

export async function syncRemindersForBooking(bookingId: string): Promise<void> {
  const booking = await prisma.booking.findUnique({
    where: { id: bookingId },
  })
  if (!booking) return
  if (booking.status !== 'CONFIRMED') return

  const policy = await getReminderPolicy(booking.businessId)
  const appointmentDateTime = combineAppointmentDateTime(
    booking.appointmentDate,
    booking.startTime
  )
  const planned = planReminders(appointmentDateTime, policy)

  if (planned.length === 0) return

  await prisma.reminder.createMany({
    data: planned.map((p) => ({
      bookingId,
      channel: p.channel,
      intervalKey: p.intervalKey,
      scheduledFor: p.scheduledFor,
      status: 'PENDING',
    })),
  })
}

// Cancels all active future reminder work for a booking.
// Active work includes both PENDING (not yet due) and RETRY_PENDING (scheduled for retry).
// Terminal statuses (SENT, FAILED, CANCELLED) are preserved as historical truth.
export async function cancelPendingRemindersForBooking(bookingId: string): Promise<void> {
  await prisma.reminder.updateMany({
    where: {
      bookingId,
      status: { in: ['PENDING', 'RETRY_PENDING'] },
    },
    data: {
      status: 'CANCELLED',
      nextAttemptAt: null,
    },
  })
}

export async function resyncRemindersForBooking(bookingId: string): Promise<void> {
  await cancelPendingRemindersForBooking(bookingId)
  await syncRemindersForBooking(bookingId)
}
