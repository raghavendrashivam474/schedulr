import { prisma } from '@lib/prisma'
import type { DateRange, MetricValue, AppointmentMetrics, CustomerMetrics } from '../types'

function buildMetricValue(current: number, previous: number): MetricValue {
  const change = current - previous
  let changePercent = 0
  if (previous === 0 && current === 0) {
    changePercent = 0
  } else if (previous === 0) {
    changePercent = 100
  } else {
    changePercent = Math.round((change / previous) * 100 * 10) / 10
  }
  const trend = change > 0 ? 'UP' : change < 0 ? 'DOWN' : 'STABLE'
  return { value: current, previousValue: previous, change, changePercent, trend }
}

function safeRate(numerator: number, denominator: number): number {
  if (denominator === 0) return 0
  return Math.round((numerator / denominator) * 100 * 10) / 10
}

async function countBookingsByStatus(
  businessId: string,
  dateRange: DateRange,
  status?: string
): Promise<number> {
  const where = {
    businessId,
    appointmentDate: { gte: dateRange.start, lte: dateRange.end },
    ...(status ? { status: status as never } : {}),
  }
  return prisma.booking.count({ where })
}

export async function calculateAppointmentMetrics(
  businessId: string,
  current: DateRange,
  previous: DateRange
): Promise<AppointmentMetrics> {
  const now = new Date()

  const [curTotal, curCompleted, curCancelled, curNoShow,
    prevTotal, prevCompleted, prevCancelled, prevNoShow, upcoming] =
    await Promise.all([
      countBookingsByStatus(businessId, current),
      countBookingsByStatus(businessId, current, 'COMPLETED'),
      countBookingsByStatus(businessId, current, 'CANCELLED'),
      countBookingsByStatus(businessId, current, 'NO_SHOW'),
      countBookingsByStatus(businessId, previous),
      countBookingsByStatus(businessId, previous, 'COMPLETED'),
      countBookingsByStatus(businessId, previous, 'CANCELLED'),
      countBookingsByStatus(businessId, previous, 'NO_SHOW'),
      prisma.booking.count({
        where: {
          businessId,
          appointmentDate: { gte: now },
          status: { in: ['CONFIRMED', 'CHECKED_IN'] },
        },
      }),
    ])

  return {
    total: buildMetricValue(curTotal, prevTotal),
    completed: buildMetricValue(curCompleted, prevCompleted),
    cancelled: buildMetricValue(curCancelled, prevCancelled),
    noShow: buildMetricValue(curNoShow, prevNoShow),
    upcoming,
    completionRate: safeRate(curCompleted, curTotal),
    cancellationRate: safeRate(curCancelled, curTotal),
    noShowRate: safeRate(curNoShow, curTotal),
  }
}

export async function calculateCustomerMetrics(
  businessId: string,
  current: DateRange,
  previous: DateRange
): Promise<CustomerMetrics> {
  const [curTotal, prevTotal, curNew, prevNew, returning] = await Promise.all([
    prisma.customer.count({ where: { businessId, createdAt: { lte: current.end } } }),
    prisma.customer.count({ where: { businessId, createdAt: { lte: previous.end } } }),
    prisma.customer.count({ where: { businessId, createdAt: { gte: current.start, lte: current.end } } }),
    prisma.customer.count({ where: { businessId, createdAt: { gte: previous.start, lte: previous.end } } }),
    prisma.customer.count({ where: { businessId, totalVisits: { gt: 1 } } }),
  ])

  const total = await prisma.customer.count({ where: { businessId } })

  return {
    total: buildMetricValue(curTotal, prevTotal),
    newCustomers: buildMetricValue(curNew, prevNew),
    returningCustomers: returning,
    returningRate: safeRate(returning, total),
  }
}
