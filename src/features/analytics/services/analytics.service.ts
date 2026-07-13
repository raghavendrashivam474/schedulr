import { prisma } from '@lib/prisma'
import { resolvePeriodPair, isValidRange } from '../engines/time-range.engine'
import { calculateAppointmentMetrics, calculateCustomerMetrics } from '../engines/metrics.engine'
import { aggregateByService, aggregateByDay, aggregateByStatus } from '../aggregation/aggregation.service'
import { generateInsights } from '../insights/insight.engine'
import type { AnalyticsRange, AnalyticsOverview, AnalyticsAggregations, Insight } from '../types'

export async function getBusinessIdForUser(userId: string): Promise<string | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  return membership?.businessId ?? null
}

export async function getAnalyticsOverview(
  userId: string,
  range: AnalyticsRange
): Promise<AnalyticsOverview> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const { current, previous } = resolvePeriodPair(range)

  const [appointments, customers] = await Promise.all([
    calculateAppointmentMetrics(businessId, current, previous),
    calculateCustomerMetrics(businessId, current, previous),
  ])

  return { range, dateRange: current, appointments, customers }
}

export async function getAnalyticsAggregations(
  userId: string,
  range: AnalyticsRange
): Promise<AnalyticsAggregations> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const { current } = resolvePeriodPair(range)

  const [byService, byDay, byStatus] = await Promise.all([
    aggregateByService(businessId, current),
    aggregateByDay(businessId, current),
    aggregateByStatus(businessId, current),
  ])

  return { byService, byDay, byStatus }
}

export async function getAnalyticsInsights(
  userId: string,
  range: AnalyticsRange
): Promise<Insight[]> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const { current, previous } = resolvePeriodPair(range)

  const [appointments, customers, byService, byDay] = await Promise.all([
    calculateAppointmentMetrics(businessId, current, previous),
    calculateCustomerMetrics(businessId, current, previous),
    aggregateByService(businessId, current),
    aggregateByDay(businessId, current),
  ])

  return generateInsights(appointments, customers, byService, byDay)
}

export { isValidRange }
