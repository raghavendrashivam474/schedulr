'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { WeeklySchedule, Holiday } from '@appTypes/index'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function AvailabilityPage() {
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([])
  const [holidays, setHolidays] = useState<Holiday[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [holidayForm, setHolidayForm] = useState({ date: '', label: '' })
  const [message, setMessage] = useState('')

  const fetchData = useCallback(async () => {
    try {
      const [schedRes, holRes] = await Promise.all([
        fetch('/api/schedule'),
        fetch('/api/availability'),
      ])
      const [schedData, holData] = await Promise.all([schedRes.json(), holRes.json()])
      if (schedData.success) setSchedules(schedData.data.schedules)
      if (holData.success) setHolidays(holData.data.holidays)
    } finally {
      setLoading(false)
    }
  }, [])

  useEffect(() => { fetchData() }, [fetchData])

  function updateSchedule(index: number, field: string, value: string | boolean) {
    setSchedules((prev) => prev.map((s, i) => i === index ? { ...s, [field]: value } : s))
  }

  async function saveSchedule() {
    setSaving(true)
    setMessage('')
    try {
      const res = await fetch('/api/schedule', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          schedules: schedules.map((s) => ({
            dayOfWeek: s.dayOfWeek,
            isOpen: s.isOpen,
            openTime: s.openTime,
            closeTime: s.closeTime,
            breaks: s.breaks ?? [],
          })),
        }),
      })
      const data = await res.json()
      if (data.success) setMessage('Schedule saved successfully')
    } finally {
      setSaving(false)
    }
  }

  async function addHoliday(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/availability', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(holidayForm),
    })
    const data = await res.json()
    if (data.success) {
      setHolidays((prev) => [...prev, data.data.holiday])
      setHolidayForm({ date: '', label: '' })
    }
  }

  async function removeHoliday(id: string) {
    await fetch('/api/availability/' + id, { method: 'DELETE' })
    setHolidays((prev) => prev.filter((h) => h.id !== id))
  }

  return (
    <DashboardLayout>
      <div className="max-w-3xl space-y-8">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Availability</h1>
          <p className="mt-1 text-sm text-gray-600">Configure when your business is open</p>
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Weekly Schedule</h2>
          {loading ? (
            <p className="text-sm text-gray-500">Loading...</p>
          ) : (
            <div className="space-y-3">
              {schedules.map((schedule, index) => (
                <div key={schedule.dayOfWeek} className="flex items-center gap-4">
                  <div className="w-28">
                    <p className="text-sm font-medium text-gray-700">{DAY_NAMES[schedule.dayOfWeek]}</p>
                  </div>
                  <input type="checkbox" checked={schedule.isOpen}
                    onChange={(e) => updateSchedule(index, 'isOpen', e.target.checked)}
                    className="h-4 w-4 rounded border-gray-300 text-blue-600" />
                  {schedule.isOpen ? (
                    <div className="flex items-center gap-2">
                      <input type="time" value={schedule.openTime}
                        onChange={(e) => updateSchedule(index, 'openTime', e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm" />
                      <span className="text-sm text-gray-500">to</span>
                      <input type="time" value={schedule.closeTime}
                        onChange={(e) => updateSchedule(index, 'closeTime', e.target.value)}
                        className="rounded-md border border-gray-300 px-2 py-1 text-sm" />
                    </div>
                  ) : (
                    <span className="text-sm text-gray-400">Closed</span>
                  )}
                </div>
              ))}
              {message && <p className="mt-2 text-sm text-green-600">{message}</p>}
              <button onClick={saveSchedule} disabled={saving}
                className="mt-2 rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700 disabled:opacity-50">
                {saving ? 'Saving...' : 'Save Schedule'}
              </button>
            </div>
          )}
        </div>

        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="mb-4 text-base font-semibold text-gray-900">Holidays</h2>
          <form onSubmit={addHoliday} className="mb-4 flex gap-3">
            <input type="date" required value={holidayForm.date}
              onChange={(e) => setHolidayForm({ ...holidayForm, date: e.target.value })}
              className="rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <input type="text" required placeholder="Label e.g. Christmas" value={holidayForm.label}
              onChange={(e) => setHolidayForm({ ...holidayForm, label: e.target.value })}
              className="flex-1 rounded-md border border-gray-300 px-3 py-2 text-sm" />
            <button type="submit" className="rounded-md bg-blue-600 px-4 py-2 text-sm font-medium text-white hover:bg-blue-700">Add</button>
          </form>
          {holidays.length === 0 ? (
            <p className="text-sm text-gray-400">No holidays configured</p>
          ) : (
            <div className="space-y-2">
              {holidays.map((holiday) => (
                <div key={holiday.id} className="flex items-center justify-between rounded-md border border-gray-100 px-4 py-2">
                  <div>
                    <p className="text-sm font-medium text-gray-800">{holiday.label}</p>
                    <p className="text-xs text-gray-400">{new Date(holiday.date).toLocaleDateString()}</p>
                  </div>
                  <button onClick={() => removeHoliday(holiday.id)} className="text-sm text-red-500 hover:text-red-700">Remove</button>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </DashboardLayout>
  )
}
