'use client'

import { useState, useEffect } from 'react'
import { useParams } from 'next/navigation'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import Link from 'next/link'
import type { Customer, Booking, Service } from '@appTypes/index'

type BookingWithService = Booking & { service: Service }

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  NO_SHOW: 'bg-orange-100 text-orange-600',
}

export default function CustomerDetailPage() {
  const params = useParams()
  const customerId = params.id as string

  const [customer, setCustomer] = useState<Customer | null>(null)
  const [history, setHistory] = useState<BookingWithService[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState(false)
  const [notes, setNotes] = useState('')
  const [saving, setSaving] = useState(false)

  useEffect(() => {
    void fetch('/api/customers/' + customerId)
      .then((r) => r.json())
      .then((data: { success: boolean; data: { customer: Customer; history: BookingWithService[] } }) => {
        if (data.success) {
          setCustomer(data.data.customer)
          setHistory(data.data.history)
          setNotes(data.data.customer.notes ?? '')
        }
      })
      .finally(() => setLoading(false))
  }, [customerId])

  async function saveNotes() {
    setSaving(true)
    try {
      const res = await fetch('/api/customers/' + customerId, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ notes }),
      })
      const data = await res.json()
      if (data.success) {
        setCustomer(data.data.customer)
        setEditing(false)
      }
    } finally {
      setSaving(false)
    }
  }

  if (loading) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Loading...</p></DashboardLayout>

  if (!customer) return <DashboardLayout><p className="p-8 text-sm text-gray-500">Customer not found</p></DashboardLayout>

  return (
    <DashboardLayout>
      <div className="max-w-3xl">
        <div className="mb-4">
          <Link href="/customers" className="text-sm text-blue-600 hover:underline">Back to Customers</Link>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">{customer.name}</h1>
              <div className="mt-1 text-sm text-gray-500">{customer.email}</div>
              {customer.phone && <div className="text-sm text-gray-500">{customer.phone}</div>}
            </div>
            <div className="text-right">
              <div className="text-3xl font-bold text-gray-900">{customer.totalVisits}</div>
              <div className="text-xs text-gray-400">total visits</div>
            </div>
          </div>

          <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
            {customer.firstVisit && (
              <div>
                <div className="text-gray-400">First visit</div>
                <div className="font-medium">{new Date(customer.firstVisit).toLocaleDateString('en-GB')}</div>
              </div>
            )}
            {customer.lastVisit && (
              <div>
                <div className="text-gray-400">Last visit</div>
                <div className="font-medium">{new Date(customer.lastVisit).toLocaleDateString('en-GB')}</div>
              </div>
            )}
          </div>

          <div className="mt-4">
            <div className="flex items-center justify-between mb-1">
              <div className="text-sm font-medium text-gray-700">Notes</div>
              <button onClick={() => setEditing(!editing)} className="text-xs text-blue-600 hover:underline">
                {editing ? 'Cancel' : 'Edit'}
              </button>
            </div>
            {editing ? (
              <div>
                <textarea value={notes} onChange={(e) => setNotes(e.target.value)}
                  rows={3}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm focus:border-blue-500 focus:outline-none"
                  placeholder="Add notes about this customer..." />
                <button onClick={saveNotes} disabled={saving}
                  className="mt-2 rounded-md bg-blue-600 px-3 py-1.5 text-xs font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                  {saving ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            ) : (
              <div className="text-sm text-gray-500">
                {customer.notes ?? 'No notes yet'}
              </div>
            )}
          </div>
        </div>

        <div className="mt-6">
          <h2 className="mb-3 text-base font-semibold text-gray-900">Appointment History</h2>
          {history.length === 0 && (
            <p className="text-sm text-gray-400">No appointment history</p>
          )}
          <div className="space-y-2">
            {history.map((booking) => (
              <div key={booking.id} className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm">
                <div>
                  <div className="font-medium text-gray-900">{booking.service.name}</div>
                  <div className="text-sm text-gray-500">
                    {new Date(booking.appointmentDate).toLocaleDateString('en-GB', {
                      weekday: 'short', year: 'numeric', month: 'short', day: 'numeric'
                    })}{' at '}{booking.startTime}
                  </div>
                </div>
                <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + STATUS_COLORS[booking.status]}>
                  {booking.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
