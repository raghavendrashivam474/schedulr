import type {
  AppointmentMetrics,
  CustomerMetrics,
  ServiceAggregation,
  DayAggregation,
  Insight,
} from '../types'

export function generateInsights(
  appointments: AppointmentMetrics,
  customers: CustomerMetrics,
  byService: ServiceAggregation[],
  byDay: DayAggregation[]
): Insight[] {
  const insights: Insight[] = []

  // Most popular service
  if (byService.length > 0 && byService[0].count > 0) {
    const top = byService[0]
    insights.push({
      type: 'TOP_SERVICE',
      title: 'Most Popular Service',
      message: top.serviceName + ' is your most booked service with ' + top.count + ' appointment' + (top.count !== 1 ? 's' : '') + ' (' + top.percentage + '%).',
      severity: 'info',
      metric: top.count,
    })
  }

  // Busiest day
  const busiestDay = [...byDay].sort((a, b) => b.count - a.count)[0]
  if (busiestDay && busiestDay.count > 0) {
    insights.push({
      type: 'BUSIEST_DAY',
      title: 'Busiest Day',
      message: busiestDay.dayName + ' is your busiest appointment day with ' + busiestDay.count + ' appointment' + (busiestDay.count !== 1 ? 's' : '') + '.',
      severity: 'info',
      metric: busiestDay.count,
    })
  }

  // No-show trend
  if (appointments.noShow.trend === 'UP' && appointments.noShow.value > 0) {
    insights.push({
      type: 'NO_SHOW_INCREASE',
      title: 'No-Show Rate Increasing',
      message: 'Your no-show rate increased by ' + Math.abs(appointments.noShow.changePercent) + '% compared with the previous period. Consider sending appointment reminders.',
      severity: 'warning',
      metric: appointments.noShowRate,
    })
  }

  // High no-show rate
  if (appointments.noShowRate >= 15) {
    insights.push({
      type: 'HIGH_NO_SHOW_RATE',
      title: 'High No-Show Rate',
      message: appointments.noShowRate + '% of appointments result in no-shows. This is above the recommended threshold of 15%.',
      severity: 'warning',
      metric: appointments.noShowRate,
    })
  }

  // Appointment volume trend
  if (appointments.total.trend === 'UP' && appointments.total.value > 0) {
    insights.push({
      type: 'VOLUME_GROWTH',
      title: 'Booking Volume Growing',
      message: 'Appointments increased by ' + appointments.total.changePercent + '% compared with the previous period.',
      severity: 'success',
      metric: appointments.total.changePercent,
    })
  }

  if (appointments.total.trend === 'DOWN' && appointments.total.previousValue > 0) {
    insights.push({
      type: 'VOLUME_DECLINE',
      title: 'Booking Volume Declining',
      message: 'Appointments decreased by ' + Math.abs(appointments.total.changePercent) + '% compared with the previous period.',
      severity: 'warning',
      metric: appointments.total.changePercent,
    })
  }

  // Returning customers
  if (customers.returningRate >= 30) {
    insights.push({
      type: 'STRONG_RETENTION',
      title: 'Strong Customer Retention',
      message: customers.returningRate + '% of your customers are returning customers. Strong retention indicates customer satisfaction.',
      severity: 'success',
      metric: customers.returningRate,
    })
  }

  // Good completion rate
  if (appointments.completionRate >= 80 && appointments.total.value > 0) {
    insights.push({
      type: 'HIGH_COMPLETION',
      title: 'High Completion Rate',
      message: appointments.completionRate + '% of appointments are being completed successfully.',
      severity: 'success',
      metric: appointments.completionRate,
    })
  }

  return insights
}
