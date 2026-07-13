'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type {
  AnalyticsOverview,
  AnalyticsAggregations,
  Insight,
  AnalyticsRange,
} from '@features/analytics/types'

const RANGES: { label: string; value: AnalyticsRange }[] = [
  { label: 'Today', value: 'today' },
  { label: 'This Week', value: 'week' },
  { label: 'This Month', value: 'month' },
]

const SEVERITY_STYLES: Record<string, string> = {
  info: 'bg-blue-50 border-blue-200 text-blue-800',
  warning: 'bg-yellow-50 border-yellow-200 text-yellow-800',
  success: 'bg-green-50 border-green-200 text-green-800',
}

const TREND_STYLES: Record<string, string> = {
  UP: 'text-green-600',
  DOWN: 'text-red-600',
  STABLE: 'text-gray-400',
}

export default function DashboardPage() {
  const [range, setRange] = useState<AnalyticsRange>('month')
  const [overview, setOverview] = useState<AnalyticsOverview | null>(null)
  const [aggregations, setAggregations] = useState<AnalyticsAggregations | null>(null)
  const [insights, setInsights] = useState<Insight[]>([])
  const [loading, setLoading] = useState(true)

  const fetchAnalytics = useCallback(async () => {
    setLoading(true)
    try {
      const [ovRes, aggRes, insRes] = await Promise.all([
        fetch('/api/analytics/overview?range=' + range),
        fetch('/api/analytics/appointments?range=' + range),
        fetch('/api/analytics/insights?range=' + range),
      ])
      const [ovData, aggData, insData] = await Promise.all([
        ovRes.json(),
        aggRes.json(),
        insRes.json(),
      ])
      if (ovData.success) setOverview(ovData.data)
      if (aggData.success) setAggregations(aggData.data)
      if (insData.success) setInsights(insData.data.insights)
    } finally {
      setLoading(false)
    }
  }, [range])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchAnalytics()
  }, [fetchAnalytics])

  const apt = overview?.appointments
  const cust = overview?.customers

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Business Intelligence</h1>
            <p className="mt-1 text-sm text-gray-600">Operational insights for your business</p>
          </div>
          <div className="flex gap-2">
            {RANGES.map((r) => (
              <button key={r.value} onClick={() => setRange(r.value)}
                className={'px-3 py-1.5 rounded-md text-sm font-medium ' + (range === r.value ? 'bg-blue-600 text-white' : 'bg-white border border-gray-300 text-gray-700 hover:bg-gray-50')}>
                {r.label}
              </button>
            ))}
          </div>
        </div>

        {loading ? (
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="h-24 rounded-xl border border-gray-200 bg-white animate-pulse" />
            ))}
          </div>
        ) : (
          <>
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Appointments</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                {[
                  { label: 'Total', metric: apt?.total },
                  { label: 'Completed', metric: apt?.completed },
                  { label: 'Cancelled', metric: apt?.cancelled },
                  { label: 'No Shows', metric: apt?.noShow },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="text-xs font-medium text-gray-500">{item.label}</div>
                    <div className="mt-1 text-2xl font-bold text-gray-900">{item.metric?.value ?? 0}</div>
                    {item.metric && item.metric.previousValue > 0 && (
                      <div className={'text-xs mt-1 ' + TREND_STYLES[item.metric.trend]}>
                        {item.metric.trend === 'UP' ? '+' : ''}{item.metric.changePercent}% vs prev
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Performance Rates</h2>
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
                {[
                  { label: 'Completion Rate', value: apt?.completionRate ?? 0, color: 'bg-green-500' },
                  { label: 'Cancellation Rate', value: apt?.cancellationRate ?? 0, color: 'bg-red-400' },
                  { label: 'No-Show Rate', value: apt?.noShowRate ?? 0, color: 'bg-orange-400' },
                ].map((item) => (
                  <div key={item.label} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                    <div className="flex items-center justify-between mb-2">
                      <div className="text-sm font-medium text-gray-700">{item.label}</div>
                      <div className="text-lg font-bold text-gray-900">{item.value}%</div>
                    </div>
                    <div className="h-2 rounded-full bg-gray-100">
                      <div className={'h-2 rounded-full ' + item.color} style={{ width: Math.min(item.value, 100) + '%' }} />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Customers</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Total Customers</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{cust?.total.value ?? 0}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">New This Period</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{cust?.newCustomers.value ?? 0}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Returning</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{cust?.returningCustomers ?? 0}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Return Rate</div>
                  <div className="mt-1 text-2xl font-bold text-gray-900">{cust?.returningRate ?? 0}%</div>
                </div>
              </div>
            </div>

            {aggregations && aggregations.byService.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Services</h2>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="space-y-3">
                    {aggregations.byService.map((s) => (
                      <div key={s.serviceId}>
                        <div className="flex items-center justify-between mb-1">
                          <span className="text-sm font-medium text-gray-700">{s.serviceName}</span>
                          <span className="text-sm text-gray-500">{s.count} ({s.percentage}%)</span>
                        </div>
                        <div className="h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-blue-500" style={{ width: s.percentage + '%' }} />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {aggregations && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Appointments by Day</h2>
                <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
                  <div className="space-y-2">
                    {aggregations.byDay.filter((d) => d.count > 0).sort((a, b) => b.count - a.count).map((d) => (
                      <div key={d.dayOfWeek} className="flex items-center gap-3">
                        <div className="w-24 text-sm text-gray-600">{d.dayName}</div>
                        <div className="flex-1 h-2 rounded-full bg-gray-100">
                          <div className="h-2 rounded-full bg-blue-400" style={{ width: d.percentage + '%' }} />
                        </div>
                        <div className="w-8 text-right text-sm text-gray-500">{d.count}</div>
                      </div>
                    ))}
                    {aggregations.byDay.every((d) => d.count === 0) && (
                      <p className="text-sm text-gray-400">No appointment data for this period</p>
                    )}
                  </div>
                </div>
              </div>
            )}

            {insights.length > 0 && (
              <div>
                <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Insights</h2>
                <div className="space-y-2">
                  {insights.map((insight, i) => (
                    <div key={i} className={'rounded-xl border p-4 ' + SEVERITY_STYLES[insight.severity]}>
                      <div className="font-medium text-sm">{insight.title}</div>
                      <div className="mt-0.5 text-sm opacity-90">{insight.message}</div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {!loading && apt?.total.value === 0 && (
              <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
                <p className="text-sm font-medium text-gray-500">No data for this period</p>
                <p className="mt-1 text-xs text-gray-400">Analytics will appear as your business receives appointments</p>
              </div>
            )}
          </>
        )}
      </div>
    </DashboardLayout>
  )
}
