// Time Range Types
export type AnalyticsRange = 'today' | 'week' | 'month'

export interface DateRange {
  start: Date
  end: Date
  label: string
}

export interface PeriodPair {
  current: DateRange
  previous: DateRange
}

// Metric Types
export type TrendDirection = 'UP' | 'DOWN' | 'STABLE'

export interface MetricValue {
  value: number
  previousValue: number
  change: number
  changePercent: number
  trend: TrendDirection
}

export interface AppointmentMetrics {
  total: MetricValue
  completed: MetricValue
  cancelled: MetricValue
  noShow: MetricValue
  upcoming: number
  completionRate: number
  cancellationRate: number
  noShowRate: number
}

export interface CustomerMetrics {
  total: MetricValue
  newCustomers: MetricValue
  returningCustomers: number
  returningRate: number
}

// Aggregation Types
export interface ServiceAggregation {
  serviceId: string
  serviceName: string
  count: number
  percentage: number
}

export interface DayAggregation {
  dayOfWeek: number
  dayName: string
  count: number
  percentage: number
}

export interface StatusAggregation {
  status: string
  count: number
  percentage: number
}

// Insight Types
export type InsightSeverity = 'info' | 'warning' | 'success'

export interface Insight {
  type: string
  title: string
  message: string
  severity: InsightSeverity
  metric?: number
}

// Dashboard Types
export interface AnalyticsOverview {
  range: AnalyticsRange
  dateRange: DateRange
  appointments: AppointmentMetrics
  customers: CustomerMetrics
}

export interface AnalyticsAggregations {
  byService: ServiceAggregation[]
  byDay: DayAggregation[]
  byStatus: StatusAggregation[]
}
