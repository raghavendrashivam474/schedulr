'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'

export default function SettingsPage() {
  const [form, setForm] = useState({ bookingWindowDays: 30, advanceBookingHours: 24, cancellationHours: 24, defaultDuration: 60 })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/business').then((r) => r.json()).then((data) => {
      if (data.success && data.data.business) {
        const b = data.data.business
        setForm({ bookingWindowDays: b.bookingWindowDays, advanceBookingHours: b.advanceBookingHours, cancellationHours: b.cancellationHours, defaultDuration: b.defaultDuration })
      }
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/business/settings', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setMessage('Settings saved successfully')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p className="text-sm text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">Configure your booking policies</p>

        <form onSubmit={handleSave} className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Booking window (days)</label>
              <p className="mb-1 text-xs text-gray-400">How far in advance customers can book</p>
              <input type="number" min={1} max={365} value={form.bookingWindowDays}
                onChange={(e) => setForm({ ...form, bookingWindowDays: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Minimum advance booking (hours)</label>
              <p className="mb-1 text-xs text-gray-400">Minimum notice required before a booking</p>
              <input type="number" min={0} max={720} value={form.advanceBookingHours}
                onChange={(e) => setForm({ ...form, advanceBookingHours: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Cancellation window (hours)</label>
              <p className="mb-1 text-xs text-gray-400">How many hours before a booking can be cancelled</p>
              <input type="number" min={0} max={720} value={form.cancellationHours}
                onChange={(e) => setForm({ ...form, cancellationHours: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Default appointment duration (minutes)</label>
              <p className="mb-1 text-xs text-gray-400">Used when no service duration is specified</p>
              <input type="number" min={5} max={480} value={form.defaultDuration}
                onChange={(e) => setForm({ ...form, defaultDuration: Number(e.target.value) })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Settings'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
