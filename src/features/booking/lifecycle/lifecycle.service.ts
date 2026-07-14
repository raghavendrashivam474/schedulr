import { prisma } from '@lib/prisma'
import { cancelPendingRemindersForBooking } from '@features/reminders/services/reminder-sync.service'
import type { BookingStatus } from '@appTypes/index'

type TransitionMap = Partial<Record<BookingStatus, BookingStatus[]>>

const VALID_TRANSITIONS: TransitionMap = {
  CONFIRMED: ['CHECKED_IN', 'CANCELLED', 'NO_SHOW'],
  CHECKED_IN: ['IN_PROGRESS', 'CANCELLED', 'NO_SHOW'],
  IN_PROGRESS: ['COMPLETED'],
  COMPLETED: [],
  CANCELLED: [],
  NO_SHOW: [],
}

export function isValidTransition(
  from: BookingStatus,
  to: BookingStatus
): boolean {
  const allowed = VALID_TRANSITIONS[from] ?? []
  return allowed.includes(to)
}

export async function transitionBookingStatus(
  bookingId: string,
  userId: string,
  newStatus: BookingStatus,
  note?: string
): Promise<{ id: string; status: BookingStatus }> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId: membership.businessId },
  })
  if (!booking) throw new Error('Booking not found')

  if (!isValidTransition(booking.status as BookingStatus, newStatus)) {
    throw new Error(
      'Invalid transition from ' + booking.status + ' to ' + newStatus
    )
  }

  const updated = await prisma.booking.update({
    where: { id: bookingId },
    data: { status: newStatus },
  })

  await prisma.appointmentTimeline.create({
    data: {
      bookingId,
      customerId: booking.customerId,
      status: newStatus,
      note: note ?? null,
      performedBy: userId,
    },
  })

  // Sync reminders when appointment leaves an active state
  if (newStatus === 'CANCELLED' || newStatus === 'NO_SHOW' || newStatus === 'COMPLETED') {
    await cancelPendingRemindersForBooking(bookingId)
  }

  return { id: updated.id, status: updated.status as BookingStatus }
}

export async function getBookingTimeline(bookingId: string) {
  return prisma.appointmentTimeline.findMany({
    where: { bookingId },
    orderBy: { createdAt: 'asc' },
  })
}
