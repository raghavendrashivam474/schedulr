'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import Link from 'next/link'
import type { BookingWithDetails, TimeSlot } from '@appTypes/index'

const STATUS_COLORS: Record<string, string> = {
  CONFIRMED: 'bg-green-100 text-green-700',
  CHECKED_IN: 'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-yellow-100 text-yellow-700',
  COMPLETED: 'bg-gray-100 text-gray-600',
  CANCELLED: 'bg-red-100 text-red-600',
  NO_SHOW: 'bg-orange-100 text-orange-600',
}

const LIFECYCLE_ACTIONS: Record<string, { label: string; next: string }[]> = {
  CONFIRMED: [
    { label: 'Check In', next: 'CHECKED_IN' },
    { label: 'No Show', next: 'NO_SHOW' },
    { label: 'Cancel', next: 'CANCELLED' },
  ],
  CHECKED_IN: [
    { label: 'Start', next: 'IN_PROGRESS' },
    { label: 'No Show', next: 'NO_SHOW' },
  ],
  IN_PROGRESS: [
    { label: 'Complete', next: 'COMPLETED' },
  ],
}

export default function BookingsPage() {
  const [bookings, setBookings] = useState<BookingWithDetails[]>([])
  const [loading, setLoading] = useState(true)
  const [filter, setFilter] = useState('ALL')
  const [reschedulingId, setReschedulingId] = useState<string | null>(null)
  const [rescheduleDate, setRescheduleDate] = useState('')
  const [rescheduleSlots, setRescheduleSlots] = useState<TimeSlot[]>([])
  const [rescheduleLoading, setRescheduleLoading] = useState(false)
  const [rescheduleError, setRescheduleError] = useState('')

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

  async function handleTransition(id: string, newStatus: string) {
    const res = await fetch('/api/bookings/' + id + '/status', {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    })
    const data = await res.json()
    if (data.success) {
      setBookings((prev) => prev.map((b) =>
        b.id === id ? { ...b, status: newStatus as BookingWithDetails['status'] } : b
      ))
    } else {
      alert(data.error)
    }
  }

  async function openReschedule(bookingId: string) {
    setReschedulingId(bookingId)
    setRescheduleDate('')
    setRescheduleSlots([])
    setRescheduleError('')
  }

  async function loadRescheduleSlots(bookingId: string, date: string) {
    setRescheduleLoading(true)
    setRescheduleError('')
    try {
      const res = await fetch('/api/bookings/' + bookingId + '/reschedule-slots?date=' + date)
      const data = await res.json()
      if (data.success) setRescheduleSlots(data.data.slots)
    } finally {
      setRescheduleLoading(false)
    }
  }

  async function confirmReschedule(bookingId: string, startTime: string) {
    setRescheduleError('')
    const res = await fetch('/api/bookings/' + bookingId + '/reschedule', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        newAppointmentDate: rescheduleDate,
        newStartTime: startTime,
      }),
    })
    const data = await res.json()
    if (!res.ok) {
      setRescheduleError(data.error ?? 'Failed to reschedule')
      return
    }
    setReschedulingId(null)
    void fetchBookings()
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

        <div className="mt-4 flex flex-wrap gap-2">
          {['ALL', 'CONFIRMED', 'CHECKED_IN', 'IN_PROGRESS', 'COMPLETED', 'CANCELLED', 'NO_SHOW'].map((s) => (
            <button key={s} onClick={() => setFilter(s)}
              className={'px-3 py-1 rounded-full text-xs font-medium ' + (filter === s ? 'bg-blue-600 text-white' : 'bg-gray-100 text-gray-600 hover:bg-gray-200')}>
              {s === 'ALL' ? 'All' : s.charAt(0) + s.slice(1).toLowerCase().replace('_', ' ')}
            </button>
          ))}
        </div>

        <div className="mt-6 space-y-3">
          {loading && <p className="text-sm text-gray-500">Loading bookings...</p>}
          {!loading && bookings.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-sm text-gray-500">No bookings found</p>
            </div>
          )}
          {bookings.map((booking) => (
            <div key={booking.id} className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{booking.customerName}</span>
                    <span className={'px-2 py-0.5 rounded-full text-xs font-medium ' + STATUS_COLORS[booking.status]}>
                      {booking.status.replace('_', ' ')}
                    </span>
                  </div>
                  <div className="mt-0.5 text-sm text-gray-500">{booking.customerEmail}</div>
                  <div className="mt-1 text-sm text-gray-700">{booking.service.name} - {booking.service.duration} min</div>
                  <div className="mt-1 text-sm font-medium text-gray-800">
                    {new Date(booking.appointmentDate).toLocaleDateString('en-GB', {
                      weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'
                    })}{' at '}{booking.startTime}{' - '}{booking.endTime}
                  </div>
                  {booking.customer && (
                    <Link href={'/customers/' + booking.customer.id}
                      className="mt-1 inline-block text-xs text-blue-500 hover:underline">
                      View customer profile
                    </Link>
                  )}
                </div>
                <div className="ml-4 flex flex-col gap-1">
                  {(booking.status === 'CONFIRMED' || booking.status === 'CHECKED_IN') && (
                    <button onClick={() => openReschedule(booking.id)}
                      className="text-xs font-medium px-2 py-1 rounded text-purple-600 hover:text-purple-800">
                      Reschedule
                    </button>
                  )}
                  {(LIFECYCLE_ACTIONS[booking.status] ?? []).map((action) => (
                    <button key={action.next}
                      onClick={() => handleTransition(booking.id, action.next)}
                      className={
                        'text-xs font-medium px-2 py-1 rounded ' +
                        (action.next === 'CANCELLED' ? 'text-red-500 hover:text-red-700' :
                        action.next === 'COMPLETED' ? 'text-blue-600 hover:text-blue-800' :
                        'text-gray-600 hover:text-gray-900')
                      }>
                      {action.label}
                    </button>
                  ))}
                </div>
              </div>

              {reschedulingId === booking.id && (
                <div className="mt-4 rounded-lg border border-purple-200 bg-purple-50 p-4">
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="text-sm font-semibold text-gray-900">Reschedule Appointment</h3>
                    <button onClick={() => setReschedulingId(null)} className="text-xs text-gray-500">Close</button>
                  </div>
                  <div className="space-y-3">
                    <input type="date" value={rescheduleDate}
                      onChange={(e) => {
                        setRescheduleDate(e.target.value)
                        if (e.target.value) void loadRescheduleSlots(booking.id, e.target.value)
                      }}
                      className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
                    {rescheduleLoading && <p className="text-xs text-gray-500">Loading slots...</p>}
                    {rescheduleSlots.filter((s) => s.available).length > 0 && (
                      <div className="grid grid-cols-4 gap-2">
                        {rescheduleSlots.filter((s) => s.available).map((slot) => (
                          <button key={slot.startTime} onClick={() => confirmReschedule(booking.id, slot.startTime)}
                            className="rounded-md border border-purple-300 bg-white px-2 py-1 text-xs font-medium text-purple-700 hover:bg-purple-100">
                            {slot.startTime}
                          </button>
                        ))}
                      </div>
                    )}
                    {rescheduleDate && !rescheduleLoading && rescheduleSlots.filter((s) => s.available).length === 0 && (
                      <p className="text-xs text-gray-500">No available slots on this date</p>
                    )}
                    {rescheduleError && <p className="text-xs text-red-600">{rescheduleError}</p>}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </DashboardLayout>
  )
}
