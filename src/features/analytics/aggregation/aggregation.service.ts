import { prisma } from '@lib/prisma'
import type { DateRange, ServiceAggregation, DayAggregation, StatusAggregation } from '../types'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

function toPercent(count: number, total: number): number {
  if (total === 0) return 0
  return Math.round((count / total) * 100 * 10) / 10
}

export async function aggregateByService(
  businessId: string,
  dateRange: DateRange
): Promise<ServiceAggregation[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      businessId,
      appointmentDate: { gte: dateRange.start, lte: dateRange.end },
    },
    include: { service: true },
  })

  const total = bookings.length
  const counts = new Map<string, { name: string; count: number }>()

  for (const booking of bookings) {
    const key = booking.serviceId
    const existing = counts.get(key)
    if (existing) {
      existing.count++
    } else {
      counts.set(key, { name: booking.service.name, count: 1 })
    }
  }

  return Array.from(counts.entries())
    .map(([serviceId, { name, count }]) => ({
      serviceId,
      serviceName: name,
      count,
      percentage: toPercent(count, total),
    }))
    .sort((a, b) => b.count - a.count)
}

export async function aggregateByDay(
  businessId: string,
  dateRange: DateRange
): Promise<DayAggregation[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      businessId,
      appointmentDate: { gte: dateRange.start, lte: dateRange.end },
    },
    select: { appointmentDate: true },
  })

  const total = bookings.length
  const counts = new Array(7).fill(0) as number[]

  for (const booking of bookings) {
    const day = new Date(booking.appointmentDate).getDay()
    counts[day]++
  }

  return counts.map((count, dayOfWeek) => ({
    dayOfWeek,
    dayName: DAY_NAMES[dayOfWeek],
    count,
    percentage: toPercent(count, total),
  }))
}

export async function aggregateByStatus(
  businessId: string,
  dateRange: DateRange
): Promise<StatusAggregation[]> {
  const bookings = await prisma.booking.findMany({
    where: {
      businessId,
      appointmentDate: { gte: dateRange.start, lte: dateRange.end },
    },
    select: { status: true },
  })

  const total = bookings.length
  const counts = new Map<string, number>()

  for (const booking of bookings) {
    const key = booking.status
    counts.set(key, (counts.get(key) ?? 0) + 1)
  }

  return Array.from(counts.entries())
    .map(([status, count]) => ({
      status,
      count,
      percentage: toPercent(count, total),
    }))
    .sort((a, b) => b.count - a.count)
}
