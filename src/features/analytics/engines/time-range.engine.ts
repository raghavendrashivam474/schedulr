import type { AnalyticsRange, DateRange, PeriodPair } from '../types'

export function resolveDateRange(range: AnalyticsRange): DateRange {
  const now = new Date()
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate())

  switch (range) {
    case 'today': {
      const start = new Date(today)
      const end = new Date(today)
      end.setHours(23, 59, 59, 999)
      return { start, end, label: 'Today' }
    }
    case 'week': {
      const dayOfWeek = today.getDay()
      const start = new Date(today)
      start.setDate(today.getDate() - dayOfWeek)
      const end = new Date(start)
      end.setDate(start.getDate() + 6)
      end.setHours(23, 59, 59, 999)
      return { start, end, label: 'This Week' }
    }
    case 'month': {
      const start = new Date(now.getFullYear(), now.getMonth(), 1)
      const end = new Date(now.getFullYear(), now.getMonth() + 1, 0)
      end.setHours(23, 59, 59, 999)
      return { start, end, label: 'This Month' }
    }
    default:
      throw new Error('Unsupported range: ' + String(range))
  }
}

export function resolvePreviousPeriod(range: AnalyticsRange, current: DateRange): DateRange {
  const durationMs = current.end.getTime() - current.start.getTime()

  switch (range) {
    case 'today': {
      const start = new Date(current.start)
      start.setDate(start.getDate() - 1)
      const end = new Date(current.end)
      end.setDate(end.getDate() - 1)
      return { start, end, label: 'Yesterday' }
    }
    case 'week': {
      const start = new Date(current.start.getTime() - 7 * 24 * 60 * 60 * 1000)
      const end = new Date(current.end.getTime() - 7 * 24 * 60 * 60 * 1000)
      return { start, end, label: 'Last Week' }
    }
    case 'month': {
      const start = new Date(current.start)
      start.setMonth(start.getMonth() - 1)
      const end = new Date(current.end)
      end.setMonth(end.getMonth() - 1)
      return { start, end, label: 'Last Month' }
    }
    default:
      throw new Error('Unsupported range: ' + String(range))
  }
  void durationMs
}

export function resolvePeriodPair(range: AnalyticsRange): PeriodPair {
  const current = resolveDateRange(range)
  const previous = resolvePreviousPeriod(range, current)
  return { current, previous }
}

export function isValidRange(range: string): range is AnalyticsRange {
  return ['today', 'week', 'month'].includes(range)
}
