'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { ReminderPolicy } from '@features/reminders/types'

export default function ReminderSettingsPage() {
  const [policy, setPolicy] = useState<ReminderPolicy>({
    reminder24h: true,
    reminder2h: true,
    reminder30m: false,
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetch('/api/business/reminders')
      .then((r) => r.json())
      .then((data: { success: boolean; data: { policy: ReminderPolicy } }) => {
        if (data.success) setPolicy(data.data.policy)
      })
      .finally(() => setLoading(false))
  }, [])

  async function handleSave() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/business/reminders', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(policy),
      })
      const data = await res.json()
      if (data.success) setMessage('Reminder settings saved')
    } finally {
      setSaving(false)
    }
  }

  const OPTIONS = [
    { key: 'reminder24h' as const, label: '24 hours before', description: 'Send a reminder 1 day before the appointment' },
    { key: 'reminder2h' as const, label: '2 hours before', description: 'Send a reminder 2 hours before the appointment' },
    { key: 'reminder30m' as const, label: '30 minutes before', description: 'Send a reminder 30 minutes before the appointment' },
  ]

  if (loading) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Appointment Reminders</h1>
        <p className="mt-1 text-sm text-gray-600">Configure when customers receive automatic reminders</p>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
          <div className="space-y-4">
            {OPTIONS.map((opt) => (
              <label key={opt.key} className="flex items-start gap-3 cursor-pointer">
                <input type="checkbox" checked={policy[opt.key]}
                  onChange={(e) => setPolicy({ ...policy, [opt.key]: e.target.checked })}
                  className="mt-1 h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500" />
                <div>
                  <div className="text-sm font-medium text-gray-900">{opt.label}</div>
                  <div className="text-xs text-gray-500">{opt.description}</div>
                </div>
              </label>
            ))}
          </div>
          <button onClick={handleSave} disabled={saving}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Reminder Settings'}
          </button>
        </div>

        <div className="mt-4 rounded-md bg-blue-50 border border-blue-200 p-3 text-xs text-blue-700">
          Reminders apply to future bookings created after these settings are saved. Existing bookings keep their originally planned reminders.
        </div>
      </div>
    </DashboardLayout>
  )
}
