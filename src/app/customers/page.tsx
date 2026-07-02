'use client'

import { useState, useEffect, useCallback } from 'react'
import DashboardLayout from '@components/dashboard/DashboardLayout'
import Link from 'next/link'
import type { Customer } from '@appTypes/index'

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  const fetchCustomers = useCallback(async () => {
    setLoading(true)
    try {
      const params = search ? '?search=' + encodeURIComponent(search) : ''
      const res = await fetch('/api/customers' + params)
      const data = await res.json()
      if (data.success) setCustomers(data.data.customers)
    } finally {
      setLoading(false)
    }
  }, [search])

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    void fetchCustomers()
  }, [fetchCustomers])

  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Customers</h1>
            <p className="mt-1 text-sm text-gray-600">Everyone who has booked with your business</p>
          </div>
        </div>

        <div className="mt-4">
          <input
            type="text"
            placeholder="Search by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full rounded-md border border-gray-300 px-4 py-2 text-sm focus:border-blue-500 focus:outline-none"
          />
        </div>

        <div className="mt-6 space-y-2">
          {loading && <p className="text-sm text-gray-500">Loading customers...</p>}
          {!loading && customers.length === 0 && (
            <div className="rounded-xl border border-dashed border-gray-300 p-12 text-center">
              <p className="text-sm text-gray-500">No customers yet</p>
              <p className="mt-1 text-xs text-gray-400">Customers appear here automatically when they book appointments</p>
            </div>
          )}
          {customers.map((customer) => (
            <Link key={customer.id} href={'/customers/' + customer.id}
              className="flex items-center justify-between rounded-xl border border-gray-200 bg-white p-4 shadow-sm hover:border-blue-300 hover:shadow-md transition-all">
              <div>
                <div className="font-medium text-gray-900">{customer.name}</div>
                <div className="text-sm text-gray-500">{customer.email}</div>
                {customer.phone && <div className="text-sm text-gray-400">{customer.phone}</div>}
              </div>
              <div className="text-right">
                <div className="text-sm font-medium text-gray-700">{customer.totalVisits} visit{customer.totalVisits !== 1 ? 's' : ''}</div>
                {customer.lastVisit && (
                  <div className="text-xs text-gray-400">
                    Last: {new Date(customer.lastVisit).toLocaleDateString('en-GB')}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
        {!loading && (
          <p className="mt-4 text-xs text-gray-400">{customers.length} customer{customers.length !== 1 ? 's' : ''}</p>
        )}
      </div>
    </DashboardLayout>
  )
}
