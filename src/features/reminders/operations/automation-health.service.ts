import { prisma } from '@lib/prisma'

export interface AutomationHealth {
  pending: number
  retryPending: number
  processing: number
  sentLast24h: number
  failedLast24h: number
  cancelledLast24h: number
  totalReminders: number
}

export interface RecentReminder {
  id: string
  intervalKey: string
  status: string
  scheduledFor: Date
  sentAt: Date | null
  failureReason: string | null
  attemptCount: number
  customerName: string
  serviceName: string
}

export async function getAutomationHealth(userId: string): Promise<AutomationHealth> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) {
    return { pending: 0, retryPending: 0, processing: 0, sentLast24h: 0, failedLast24h: 0, cancelledLast24h: 0, totalReminders: 0 }
  }

  const businessId = membership.businessId
  const dayAgo = new Date(Date.now() - 24 * 60 * 60 * 1000)

  const bookingFilter = { booking: { businessId } }

  const [pending, retryPending, processing, sentLast24h, failedLast24h, cancelledLast24h, total] = await Promise.all([
    prisma.reminder.count({ where: { ...bookingFilter, status: 'PENDING' } }),
    prisma.reminder.count({ where: { ...bookingFilter, status: 'RETRY_PENDING' } }),
    prisma.reminder.count({ where: { ...bookingFilter, status: 'PROCESSING' } }),
    prisma.reminder.count({ where: { ...bookingFilter, status: 'SENT', sentAt: { gte: dayAgo } } }),
    prisma.reminder.count({ where: { ...bookingFilter, status: 'FAILED', updatedAt: { gte: dayAgo } } }),
    prisma.reminder.count({ where: { ...bookingFilter, status: 'CANCELLED', updatedAt: { gte: dayAgo } } }),
    prisma.reminder.count({ where: bookingFilter }),
  ])

  return {
    pending,
    retryPending,
    processing,
    sentLast24h,
    failedLast24h,
    cancelledLast24h,
    totalReminders: total,
  }
}

export async function getRecentReminders(userId: string, limit = 20): Promise<RecentReminder[]> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return []

  const reminders = await prisma.reminder.findMany({
    where: { booking: { businessId: membership.businessId } },
    include: { booking: { include: { service: true } } },
    orderBy: { updatedAt: 'desc' },
    take: limit,
  })

  return reminders.map((r) => ({
    id: r.id,
    intervalKey: r.intervalKey,
    status: r.status,
    scheduledFor: r.scheduledFor,
    sentAt: r.sentAt,
    failureReason: r.failureReason,
    attemptCount: r.attemptCount,
    customerName: r.booking.customerName,
    serviceName: r.booking.service.name,
  }))
}
