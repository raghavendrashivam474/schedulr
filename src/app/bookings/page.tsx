'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { BookingWithDetails } from '@appTypes/index'

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CANCELLED: 'bg-red-100 text-red-700',
  COMPLETED: 'bg-blue-100 text-blue-700',
  NO_SHOW: 'bg-gray-100 text-gray-600',
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')

  const fetchBookings = useCallback(async () => {
    setLoading(true)
    try {
      const params = filter !== 'ALL' ? '?status=' + filter : ''
      const res = await fetch('/api/bookings' + params)
      const data = await res.json()
      if (data.success) setBookings(data.data.bookings)
    } finally {
      setLoading(false)
    }
  }, [filter])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchBookings()
  }, [fetchBookings])

  async function handleCancel(id: string) {
    if (!confirm('Are you sure you want to cancel this booking?')) return
    const res = await fetch('/api/bookings/' + id, { method: 'DELETE' })
    const data = await res.json()
    if (data.success) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: 'CANCELLED' as const } : b))
    } else {
      alert(data.error)
    }
  }

  async function handleStatusUpdate(id: string, status: string) {
    const res = await fetch('/api/bookings/' + id, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    })
    const data = await res.json()
    if (data.success) {
      setBookings((prev) => prev.map((b) => b.id === id ? { ...b, status: status as BookingWithDetails['status'] } : b))
    }
  }

  return (
    <DashboardLayout>
      <div className="max-w-5xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Bookings</h1>
            <p className="mt-1 text-sm text-gray-600">Manage your appointments</p>
          </div>
        </div>

        <div className="mt-4 flex gap-2">
          {['ALL', 'CONFIRMED', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={'px-3 py-1 rounded-full text-xs font-medium ' + (filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {s === 'NO_SHOW' ? 'No show' : s.charAt(0) + s.slice(1).toLowerCase()}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading bookings...</p>}
          {!loading && bookings.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-sm text-gray-500">No bookings found</p>
              <p className="mt-1 text-xs text-gray-400">Bookings appear here when customers make appointments</p>
            </div>
          )}
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{booking.customerName}</span>
                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + STATUS_COLORS[booking.status]}>
                      {booking.status}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">{booking.customerEmail}</div>
                  <div className="mt-1 text-sm text-gray-700">
                    {booking.service.name} - {booking.service.duration} min
                  </div>
                  <div className="mt-1 text-sm font-medium text-gray-800">
                    {new Date(booking.appointmentDate).toLocaleDateString('en-GB', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}{' at '}{booking.startTime}{' - '}{booking.endTime}
                  </div>
                  {booking.notes && (
                    <div className="mt-1 text-xs text-gray-400">Note: {booking.notes}</div>
                  )}
                </div>
                <div className="ml-4 flex flex-col gap-2">
                  {booking.status === 'CONFIRMED' && (
                    <>
                      <button onClick={() => handleStatusUpdate(booking.id, 'COMPLETED')}
                        className="text-xs font-medium text-blue-600 hover:text-blue-800">Mark Complete</button>
                      <button onClick={() => handleStatusUpdate(booking.id, 'NO_SHOW')}
                        className="text-xs font-medium text-gray-500 hover:text-gray-700">No Show</button>
                      <button onClick={() => handleCancel(booking.id)}
                        className="text-xs font-medium text-red-500 hover:text-red-700">Cancel</button>
                    </>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
