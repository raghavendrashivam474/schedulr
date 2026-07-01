'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { Service } from '@appTypes/index'

export default function ServicesPage() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', duration: 60 })
  const [error, setError] = useState('')
  const [saving, setSaving] = useState(false)

  const fetchServices = useCallback(async () => {
    try {
      const res = await fetch('/api/services')
      const data = await res.json()
      if (data.success) setServices(data.data.services)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchServices() }, [fetchServices])

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setSaving(true)
    try {
      const res = await fetch('/api/services', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...form, duration: Number(form.duration) }),
      })
      const data = await res.json()
      if (!res.ok) { setError(data.error ?? 'Failed to create service'); return }
      setServices((prev) => [...prev, data.data.service])
      setForm({ name: '', description: '', duration: 60 })
      setShowForm(false)
    } finally {
      setSaving(false)
    }
  }

  async function handleArchive(id: string) {
    await fetch('/api/services/' + id, { method: 'DELETE' })
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, status: 'ARCHIVED' as const } : s))
  }

  async function handleRestore(id: string) {
    await fetch('/api/services/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: 'ACTIVE' }),
    })
    setServices((prev) => prev.map((s) => s.id === id ? { ...s, status: 'ACTIVE' as const } : s))
  }

  const activeServices = services.filter((s) => s.status === 'ACTIVE')
  const archivedServices = services.filter((s) => s.status === 'ARCHIVED')

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Services</h1>
            <p className="mt-1 text-sm text-gray-600">Manage the services your business offers</p>
          </div>
          <button onClick={() => setShowForm(true)}
            className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">
            Add Service
          </button>
        </div>

        {showForm && (
          <form onSubmit={handleCreate} className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
            <h2 className="mb-4 text-base font-semibold text-gray-900">New Service</h2>
            {error && <p className="mb-3 text-sm text-red-600">{error}</p>}
            <div className="space-y-3">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Service name</label>
                <input type="text" required value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="e.g. Haircut" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Description (optional)</label>
                <textarea value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  rows={2} placeholder="Brief description" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Duration (minutes)</label>
                <input type="number" required min={5} max={480} value={form.duration}
                  onChange={(e) => setForm({ ...form, duration: Number(e.target.value) })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none" />
              </div>
            </div>
            <div className="mt-4 flex gap-3">
              <button type="submit" disabled={saving}
                className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Service'}
              </button>
              <button type="button" onClick={() => setShowForm(false)}
                className="rounded-md border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50">
                Cancel
              </button>
            </div>
          </form>
        )}

        <div className="mt-6 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading services...</p>}
          {!loading && activeServices.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-8 text-center">
              <p className="text-sm text-gray-500">No services yet. Add your first service above.</p>
            </div>
          )}
          {activeServices.map((service) => (
            <div key={service.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div>
                <p className="font-medium text-gray-900">{service.name}</p>
                {service.description && <p className="mt-0.5 text-sm text-gray-500">{service.description}</p>}
                <p className="mt-1 text-xs text-gray-400">{service.duration} minutes</p>
              </div>
              <button onClick={() => handleArchive(service.id)}
                className="text-sm text-red-500 hover:text-red-700">Archive</button>
            </div>
          ))}
        </div>

        {archivedServices.length > 0 && (
          <div className="mt-8">
            <h2 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gray-500">Archived</h2>
            <div className="space-y-2">
              {archivedServices.map((service) => (
                <div key={service.id} className="flex items-center justify-between rounded-xl border border-gray-100 bg-gray-50 p-4">
                  <div>
                    <p className="text-sm font-medium text-gray-400">{service.name}</p>
                    <p className="text-xs text-gray-400">{service.duration} minutes</p>
                  </div>
                  <button onClick={() => handleRestore(service.id)}
                    className="text-sm text-blue-500 hover:text-blue-700">Restore</button>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </DashboardLayout>
  )
}
