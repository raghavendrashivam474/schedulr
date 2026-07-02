'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { Business } from '@appTypes/index'

const TIMEZONES = ['UTC','Europe/London','Europe/Paris','Europe/Berlin','America/New_York','America/Chicago','America/Los_Angeles','Asia/Dubai','Asia/Kolkata','Asia/Singapore','Asia/Tokyo','Australia/Sydney']

export default function ProfileSettingsPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [form, setForm] = useState({
    name: '', type: '', timeZone: '', contactEmail: '', contactPhone: '',
    address: '', description: '', website: '', instagram: '', facebook: '',
  })
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [message, setMessage] = useState('')

  useEffect(() => {
    void fetch('/api/business').then((r) => r.json()).then((data: { success: boolean; data: { business: Business } }) => {
      if (data.success && data.data.business) {
        const b = data.data.business
        setBusiness(b)
        setForm({
          name: b.name ?? '', type: b.type ?? '', timeZone: b.timeZone ?? '',
          contactEmail: b.contactEmail ?? '', contactPhone: b.contactPhone ?? '',
          address: b.address ?? '', description: b.description ?? '',
          website: b.website ?? '', instagram: b.instagram ?? '', facebook: b.facebook ?? '',
        })
      }
    }).finally(() => setLoading(false))
  }, [])

  async function handleSave(e: React.FormEvent) {
    e.preventDefault()
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/business/profile', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) {
        setBusiness(data.data.business)
        setMessage('Profile updated successfully')
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading...</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Business Profile</h1>
        <p className="mt-1 text-sm text-gray-600">This information appears on your public booking page</p>

        <form onSubmit={handleSave} className="mt-6 space-y-4 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          {message && <p className="text-sm text-green-600">{message}</p>}

          {[
            { label: 'Business name', key: 'name', type: 'text', required: true },
            { label: 'Business type', key: 'type', type: 'text', required: true },
            { label: 'Contact email', key: 'contactEmail', type: 'email', required: true },
            { label: 'Contact phone', key: 'contactPhone', type: 'tel', required: false },
            { label: 'Address', key: 'address', type: 'text', required: false },
            { label: 'Website', key: 'website', type: 'url', required: false },
            { label: 'Instagram username', key: 'instagram', type: 'text', required: false },
            { label: 'Facebook page', key: 'facebook', type: 'text', required: false },
          ].map((field) => (
            <div key={field.key}>
              <label className="mb-1 block text-sm font-medium text-gray-700">{field.label}</label>
              <input type={field.type} required={field.required}
                value={form[field.key as keyof typeof form]}
                onChange={(e) => setForm({ ...form, [field.key]: e.target.value })}
                className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
            </div>
          ))}

          <div>
            <label className="mb-1 block text-sm font-medium text-gray-700">Description</label>
            <textarea value={form.description}
              onChange={(e) => setForm({ ...form, description: e.target.value })}
              rows={3}
              placeholder="Tell customers about your business..."
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

          <button type="submit" disabled={saving}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
            {saving ? 'Saving...' : 'Save Profile'}
          </button>
        </form>
      </div>
    </DashboardLayout>
  )
}
