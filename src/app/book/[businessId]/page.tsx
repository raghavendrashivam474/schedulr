'use client'

import { useState, useEffect, useCallback } from 'react'
import { useParams } from 'next/navigation'
import type { Business, Service, TimeSlot } from '@appTypes/index'

type Step = 'service' | 'datetime' | 'details' | 'confirmation'

export default function PublicBookingPage() {
  const params = useParams()
  const businessId = params.businessId as string

  const [business, setBusiness] = useState<Business | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [step, setStep] = useState<Step>('service')
  const [selectedService, setSelectedService] = useState<Service | null>(null)
  const [selectedDate, setSelectedDate] = useState('')
  const [slots, setSlots] = useState<TimeSlot[]>([])
  const [selectedSlot, setSelectedSlot] = useState<TimeSlot | null>(null)
  const [loadingSlots, setLoadingSlots] = useState(false)
  const [form, setForm] = useState({ customerName: '', customerEmail: '', customerPhone: '', notes: '' })
  const [submitting, setSubmitting] = useState(false)
  const [confirmation, setConfirmation] = useState<Record<string, unknown> | null>(null)
  const [error, setError] = useState('')

  useEffect(() => {
    void fetch('/api/public/' + businessId)
      .then((r) => r.json())
      .then((data: { success: boolean; data: { business: Business; services: Service[] } }) => {
        if (data.success) {
          setBusiness(data.data.business)
          setServices(data.data.services)
        }
      })
  }, [businessId])

  const fetchSlots = useCallback(async () => {
    if (!selectedService || !selectedDate) return
    setLoadingSlots(true)
    try {
      const res = await fetch(
        '/api/slots?businessId=' + businessId + '&serviceId=' + selectedService.id + '&date=' + selectedDate
      )
      const data = await res.json()
      if (data.success) setSlots(data.data.slots)
    } finally {
      setLoadingSlots(false)
    }
  }, [selectedService, selectedDate, businessId])

  useEffect(() => {
    if (selectedDate && selectedService) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      void fetchSlots()
    }
  }, [selectedDate, selectedService, fetchSlots])

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    if (!selectedService || !selectedSlot || !selectedDate) return
    setSubmitting(true)
    setError('')
    try {
      const res = await fetch('/api/bookings', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          businessId,
          serviceId: selectedService.id,
          appointmentDate: selectedDate,
          startTime: selectedSlot.startTime,
          ...form,
        }),
      })
      const data = await res.json()
      if (!res.ok) {
        setError(data.error ?? 'Booking failed. Please try again.')
        return
      }
      setConfirmation(data.data.booking)
      setStep('confirmation')
    } finally {
      setSubmitting(false)
    }
  }

  const today = new Date().toISOString().split('T')[0]
  const maxDate = new Date()
  maxDate.setDate(maxDate.getDate() + (business?.bookingWindowDays ?? 30))
  const maxDateStr = maxDate.toISOString().split('T')[0]

  if (!business) {
    return (
      <main className="flex min-h-screen items-center justify-center">
        <p className="text-gray-500">Loading...</p>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <div className="border-b border-gray-200 bg-white px-6 py-4">
        <h1 className="text-xl font-bold text-gray-900">{business.name}</h1>
        <p className="text-sm text-gray-500">{business.type}</p>
      </div>

      <div className="mx-auto max-w-2xl px-4 py-8">

        {step === 'service' && (
          <div>
            <h2 className="mb-4 text-lg font-semibold text-gray-900">Select a Service</h2>
            <div className="space-y-3">
              {services.map((service) => (
                <button key={service.id}
                  onClick={() => { setSelectedService(service); setStep('datetime') }}
                  className="w-full rounded-xl border border-gray-200 bg-white p-5 text-left shadow-sm transition-all hover:border-blue-400 hover:shadow-md">
                  <p className="font-semibold text-gray-900">{service.name}</p>
                  {service.description && <p className="mt-1 text-sm text-gray-500">{service.description}</p>}
                  <p className="mt-2 text-sm font-medium text-blue-600">{service.duration} minutes</p>
                </button>
              ))}
            </div>
          </div>
        )}

        {step === 'datetime' && (
          <div>
            <button onClick={() => setStep('service')} className="mb-4 text-sm text-blue-600 hover:underline">Back</button>
            <h2 className="mb-1 text-lg font-semibold text-gray-900">Select a Date</h2>
            <p className="mb-4 text-sm text-gray-500">{selectedService?.name} — {selectedService?.duration} min</p>
            <input type="date" min={today} max={maxDateStr}
              value={selectedDate}
              onChange={(e) => { setSelectedDate(e.target.value); setSelectedSlot(null) }}
              className="mb-6 w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
            {selectedDate && (
              <div>
                <h3 className="mb-3 text-sm font-semibold text-gray-700">Available Times</h3>
                {loadingSlots && <p className="text-sm text-gray-400">Loading slots...</p>}
                {!loadingSlots && slots.filter((s) => s.available).length === 0 && (
                  <p className="text-sm text-gray-400">No available slots on this date</p>
                )}
                <div className="grid grid-cols-3 gap-2 sm:grid-cols-4">
                  {slots.filter((s) => s.available).map((slot) => (
                    <button key={slot.startTime}
                      onClick={() => { setSelectedSlot(slot); setStep('details') }}
                      className={'rounded-md border px-3 py-2 text-sm font-medium transition-all ' + (selectedSlot?.startTime === slot.startTime ? 'border-blue-500 bg-blue-50 text-blue-700' : 'border-gray-200 bg-white text-gray-700 hover:border-blue-300')}>
                      {slot.startTime}
                    </button>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {step === 'details' && (
          <div>
            <button onClick={() => setStep('datetime')} className="mb-4 text-sm text-blue-600 hover:underline">Back</button>
            <h2 className="mb-1 text-lg font-semibold text-gray-900">Your Details</h2>
            <p className="mb-4 text-sm text-gray-500">
              {selectedService?.name} on {selectedDate} at {selectedSlot?.startTime}
            </p>
            {error && <p className="mb-4 rounded-md bg-red-50 p-3 text-sm text-red-600">{error}</p>}
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Full name</label>
                <input type="text" required value={form.customerName}
                  onChange={(e) => setForm({ ...form, customerName: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Email address</label>
                <input type="email" required value={form.customerEmail}
                  onChange={(e) => setForm({ ...form, customerEmail: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Phone (optional)</label>
                <input type="tel" value={form.customerPhone}
                  onChange={(e) => setForm({ ...form, customerPhone: e.target.value })}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <div>
                <label className="mb-1 block text-sm font-medium text-gray-700">Notes (optional)</label>
                <textarea value={form.notes}
                  onChange={(e) => setForm({ ...form, notes: e.target.value })}
                  rows={2}
                  className="w-full rounded-md border border-gray-300 px-3 py-2 text-sm" />
              </div>
              <button type="submit" disabled={submitting}
                className="w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {submitting ? 'Confirming...' : 'Confirm Booking'}
              </button>
            </form>
          </div>
        )}

        {step === 'confirmation' && confirmation && (
          <div className="text-center">
            <div className="mx-auto mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-green-100">
              <span className="text-3xl text-green-600">&#10003;</span>
            </div>
            <h2 className="text-2xl font-bold text-gray-900">Booking Confirmed</h2>
            <p className="mt-2 text-gray-600">Your appointment has been successfully booked.</p>
            <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 text-left shadow-sm">
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Service</span>
                  <span className="font-medium">{selectedService?.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Date</span>
                  <span className="font-medium">{selectedDate}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Time</span>
                  <span className="font-medium">{selectedSlot?.startTime} — {selectedSlot?.endTime}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Business</span>
                  <span className="font-medium">{business?.name}</span>
                </div>
              </div>
            </div>
            <button onClick={() => {
              setStep('service')
              setSelectedService(null)
              setSelectedDate('')
              setSelectedSlot(null)
              setConfirmation(null)
              setForm({ customerName: '', customerEmail: '', customerPhone: '', notes: '' })
            }}
              className="mt-6 rounded-md bg-blue-600 px-6 py-2 text-sm font-medium text-white hover:bg-blue-700">
              Book Another Appointment
            </button>
          </div>
        )}
      </div>
    </main>
  )
}
