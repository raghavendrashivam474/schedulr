'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'

const TIMEZONES = ['UTC','Europe/London','Europe/Paris','Europe/Berlin','America/New_York','America/Chicago','America/Denver','America/Los_Angeles','Asia/Dubai','Asia/Singapore','Asia/Tokyo','Australia/Sydney']

export default function BusinessPage() {
  const [form, setForm] = useState({ name: '', type: '', timeZone: '', contactEmail: '', contactPhone: '', address: '' })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    fetch('/api/business').then((r) => r.json()).then((data) => {
      if (data.success && data.data.business) {
        const b = data.data.business
        setForm({ name: b.name, type: b.type, timeZone: b.timeZone, contactEmail: b.contactEmail, contactPhone: b.contactPhone ?? '', address: b.address ?? '' })
      }
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/business', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setMessage('Business profile updated successfully')
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="mt-1 text-sm text-gray-600">Manage your business information</p>

        <form onSubmit={handleSave} className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {message && <p className="mb-4 text-sm text-green-600">{message}</p>}
          <div className="space-y-4">
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business name</label>
              <input type="text" required value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Business type</label>
              <input type="text" required value={form.type}
                onChange={(e) => setForm({ ...form, type: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Time zone</label>
              <select value={form.timeZone}
                onChange={(e) => setForm({ ...form, timeZone: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none">
                {TIMEZONES.map((tz) => <option key={tz} value={tz}>{tz}</option>)}
              </select>
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contact email</label>
              <input type="email" required value={form.contactEmail}
                onChange={(e) => setForm({ ...form, contactEmail: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Contact phone</label>
              <input type="tel" value={form.contactPhone}
                onChange={(e) => setForm({ ...form, contactPhone: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
            <div>
              <label className="mb-1 block text-sm font-medium text-gray-700">Address</label>
              <input type="text" value={form.address}
                onChange={(e) => setForm({ ...form, address: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          </div>
          <button type="submit" disabled={saving}
            className="mt-6 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Changes'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
