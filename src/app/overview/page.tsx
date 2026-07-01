'use client'

import { useState, useEffect } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import type { Business, Service, WeeklySchedule } from '@appTypes/index'

const DAY_NAMES = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat']

export default function OverviewPage() {
  const [business, setBusiness] = useState<Business | null>(null)
  const [services, setServices] = useState<Service[]>([])
  const [schedules, setSchedules] = useState<WeeklySchedule[]>([])

  useEffect(() => {
    Promise.all([
      fetch('/api/business').then((r) => r.json()),
      fetch('/api/services').then((r) => r.json()),
      fetch('/api/schedule').then((r) => r.json()),
    ]).then(([bizData, svcData, schedData]) => {
      if (bizData.success) setBusiness(bizData.data.business)
      if (svcData.success) setServices(svcData.data.services)
      if (schedData.success) setSchedules(schedData.data.schedules)
    })
  }, [])

  const activeServices = services.filter((s) => s.status === 'ACTIVE')
  const openDays = schedules.filter((s) => s.isOpen)

  const steps = [
    { label: 'Create your account', done: true },
    { label: 'Set up your business profile', done: !!business },
    { label: 'Add your services', done: activeServices.length > 0 },
    { label: 'Configure availability', done: openDays.length > 0 },
    { label: 'Accept your first booking', done: false },
  ]

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          {business ? 'Welcome back, ' + business.name : 'Welcome to your dashboard'}
        </p>

        <div className="mt-6 grid grid-cols-1 gap-4 sm:grid-cols-3">
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Active Services</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{activeServices.length}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Open Days</p>
            <p className="mt-2 text-3xl font-bold text-gray-900">{openDays.length}</p>
            <p className="mt-1 text-xs text-gray-400">{openDays.map((d) => DAY_NAMES[d.dayOfWeek]).join(', ')}</p>
          </div>
          <div className="rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <p className="text-sm font-medium text-gray-500">Time Zone</p>
            <p className="mt-2 text-lg font-bold text-gray-900">{business?.timeZone ?? '-'}</p>
          </div>
        </div>

        <div className="mt-6 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Getting started</h2>
          <div className="mt-4 space-y-3">
            {steps.map((item, i) => (
              <div key={i} className="flex items-center gap-3">
                <div className={item.done ? 'flex h-6 w-6 items-center justify-center rounded-full bg-green-100 text-xs font-bold text-green-700' : 'flex h-6 w-6 items-center justify-center rounded-full bg-gray-100 text-xs font-bold text-gray-400'}>
                  {item.done ? 'v' : String(i + 1)}
                </div>
                <span className={item.done ? 'text-sm text-gray-400 line-through' : 'text-sm text-gray-700'}>{item.label}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
