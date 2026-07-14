import { prisma } from '@lib/prisma'
import type { Reminder } from '../types'

export async function getRemindersForBooking(
  userId: string,
  bookingId: string
): Promise<Reminder[]> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return []

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId: membership.businessId },
  })
  if (!booking) return []

  return prisma.reminder.findMany({
    where: { bookingId },
    orderBy: { scheduledFor: 'asc' },
  })
}
