'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'

interface Health {
  pending: number
  retryPending: number
  processing: number
  sentLast24h: number
  failedLast24h: number
  cancelledLast24h: number
  totalReminders: number
}

interface Recent {
  id: string
  intervalKey: string
  status: string
  scheduledFor: string
  sentAt: string | null
  failureReason: string | null
  attemptCount: number
  customerName: string
  serviceName: string
}

const STATUS_STYLES: Record<string, string> = {
  PENDING: 'bg-blue-100 text-blue-700',
  PROCESSING: 'bg-yellow-100 text-yellow-700',
  SENT: 'bg-green-100 text-green-700',
  FAILED: 'bg-red-100 text-red-700',
  CANCELLED: 'bg-gray-100 text-gray-600',
  RETRY_PENDING: 'bg-orange-100 text-orange-700',
}

const INTERVAL_LABELS: Record<string, string> = {
  REMINDER_24H: '24h before',
  REMINDER_2H: '2h before',
  REMINDER_30M: '30m before',
}

export default function AutomationPage() {
  const [health, setHealth] = useState<Health | null>(null)
  const [recent, setRecent] = useState<Recent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    void fetch('/api/reminders/health')
      .then((r) => r.json())
      .then((data: { success: boolean; data: { health: Health; recent: Recent[] } }) => {
        if (data.success) {
          setHealth(data.data.health)
          setRecent(data.data.recent)
        }
      })
      .finally(() => setLoading(false))
  }, [])

  if (loading) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading automation health...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-5xl space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Automation Health</h1>
          <p className="mt-1 text-sm text-gray-600">Reminder delivery status and recent activity</p>
        </div>

        {health && (
          <>
            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Active Work</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Pending</div>
                  <div className="mt-1 text-2xl font-bold text-blue-700">{health.pending}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Retry Pending</div>
                  <div className="mt-1 text-2xl font-bold text-orange-600">{health.retryPending}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Processing</div>
                  <div className="mt-1 text-2xl font-bold text-yellow-600">{health.processing}</div>
                </div>
              </div>
            </div>

            <div>
              <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Last 24 Hours</h2>
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Sent</div>
                  <div className="mt-1 text-2xl font-bold text-green-700">{health.sentLast24h}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Failed</div>
                  <div className="mt-1 text-2xl font-bold text-red-700">{health.failedLast24h}</div>
                </div>
                <div className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                  <div className="text-xs font-medium text-gray-500">Cancelled</div>
                  <div className="mt-1 text-2xl font-bold text-gray-500">{health.cancelledLast24h}</div>
                </div>
              </div>
            </div>
          </>
        )}

        <div>
          <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Recent Activity</h2>
          {recent.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">No reminder activity yet</p>
            </div>
          )}
          <div className="space-y-2">
            {recent.map((r) => (
              <div key={r.id} className="rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-sm font-medium text-gray-900">{r.customerName}</span>
                      <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + (STATUS_STYLES[r.status] ?? 'bg-gray-100 text-gray-600')}>
                        {r.status.replace('_', ' ')}
                      </span>
                      <span className="text-xs text-gray-500">{INTERVAL_LABELS[r.intervalKey] ?? r.intervalKey}</span>
                    </div>
                    <div className="mt-0.5 text-xs text-gray-500">{r.serviceName}</div>
                    <div className="mt-1 text-xs text-gray-400">
                      Scheduled: {new Date(r.scheduledFor).toLocaleString('en-GB')}
                      {r.sentAt && <span> · Sent: {new Date(r.sentAt).toLocaleString('en-GB')}</span>}
                      {r.attemptCount > 0 && <span> · Attempts: {r.attemptCount}</span>}
                    </div>
                    {r.failureReason && (
                      <div className="mt-1 text-xs text-red-600">Failure: {r.failureReason}</div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
