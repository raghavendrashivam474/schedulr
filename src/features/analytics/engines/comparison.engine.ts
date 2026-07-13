import type { MetricValue, TrendDirection } from '../types'

export function calculateTrend(current: number, previous: number): TrendDirection {
  if (current > previous) return 'UP'
  if (current < previous) return 'DOWN'
  return 'STABLE'
}

export function calculateChange(current: number, previous: number): number {
  return current - previous
}

export function calculateChangePercent(current: number, previous: number): number {
  if (previous === 0 && current === 0) return 0
  if (previous === 0) return 100
  return Math.round((((current - previous) / previous) * 100) * 10) / 10
}

export function buildComparison(current: number, previous: number): MetricValue {
  return {
    value: current,
    previousValue: previous,
    change: calculateChange(current, previous),
    changePercent: calculateChangePercent(current, previous),
    trend: calculateTrend(current, previous),
  }
}

export function formatTrendLabel(metric: MetricValue): string {
  if (metric.trend === 'STABLE') return 'No change from previous period'
  const direction = metric.trend === 'UP' ? '+' : ''
  return direction + metric.changePercent + '% vs previous period'
}
