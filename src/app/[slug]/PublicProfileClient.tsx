'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { Business, Service, WeeklySchedule } from '@appTypes/index'

const DAY_NAMES = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

interface Props {
  data: {
    business: Business
    services: Service[]
    schedules: WeeklySchedule[]
  }
}

export default function PublicProfileClient({ data }: Props) {
  const { business, services, schedules } = data
  const router = useRouter()
  const [selectedService, setSelectedService] = useState<string | null>(null)

  const openDays = schedules.filter((s) => s.isOpen)

  function handleBookNow() {
    if (selectedService) {
      router.push('/book/' + business.id + '?serviceId=' + selectedService)
    } else {
      router.push('/book/' + business.id)
    }
  }

  return (
    <main className="min-h-screen bg-gray-50">
      {business.coverImageUrl && (
        <div className="h-48 w-full bg-cover bg-center" style={{ backgroundImage: 'url(' + business.coverImageUrl + ')' }} />
      )}

      <div className="mx-auto max-w-3xl px-4 py-8">
        <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <div className="flex items-start gap-4">
            {business.logoUrl ? (
              <img src={business.logoUrl} alt={business.name}
                className="h-16 w-16 rounded-full object-cover border border-gray-200" />
            ) : (
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-blue-600 text-2xl font-bold text-white">
                {business.name.charAt(0).toUpperCase()}
              </div>
            )}
            <div className="flex-1">
              <h1 className="text-2xl font-bold text-gray-900">{business.name}</h1>
              <div className="text-sm text-gray-500">{business.type}</div>
              {business.address && <div className="mt-1 text-sm text-gray-500">{business.address}</div>}
            </div>
            <button
              onClick={handleBookNow}
              className="rounded-md bg-blue-600 px-5 py-2.5 text-sm font-medium text-white hover:bg-blue-700">
              Book Appointment
            </button>
          </div>

          {business.description && (
            <p className="mt-4 text-sm text-gray-600 leading-relaxed">{business.description}</p>
          )}

          <div className="mt-4 flex flex-wrap gap-3 text-sm">
            {business.contactPhone && (
              <span className="text-gray-600">{business.contactPhone}</span>
            )}
            {business.contactEmail && (
              <a href={'mailto:' + business.contactEmail} className="text-blue-600 hover:underline">{business.contactEmail}</a>
            )}
            {business.website && (
              <a href={business.website} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">Website</a>
            )}
            {business.instagram && (
              <a href={'https://instagram.com/' + business.instagram} target="_blank" rel="noopener noreferrer" className="text-pink-600 hover:underline">Instagram</a>
            )}
            {business.facebook && (
              <a href={'https://facebook.com/' + business.facebook} target="_blank" rel="noopener noreferrer" className="text-blue-800 hover:underline">Facebook</a>
            )}
          </div>
        </div>

        {services.length > 0 && (
          <div className="mt-6">
            <h2 className="mb-3 text-lg font-semibold text-gray-900">Our Services</h2>
            <div className="space-y-2">
              {services.map((service) => (
                <div key={service.id}
                  onClick={() => setSelectedService(service.id)}
                  className={'rounded-xl border bg-white p-4 cursor-pointer transition-all ' + (selectedService === service.id ? 'border-blue-500 shadow-md' : 'border-gray-200 hover:border-blue-300 shadow-sm')}>
                  <div className="flex items-center justify-between">
                    <div>
                      <div className="font-medium text-gray-900">{service.name}</div>
                      {service.description && <div className="mt-0.5 text-sm text-gray-500">{service.description}</div>}
                    </div>
                    <div className="text-sm font-medium text-blue-600 ml-4">{service.duration} min</div>
                  </div>
                </div>
              ))}
            </div>
            {selectedService && (
              <button onClick={handleBookNow}
                className="mt-4 w-full rounded-md bg-blue-600 py-3 text-sm font-medium text-white hover:bg-blue-700">
                Book Selected Service
              </button>
            )}
          </div>
        )}

        {openDays.length > 0 && (
          <div className="mt-6 rounded-xl border border-gray-200 bg-white p-5 shadow-sm">
            <h2 className="mb-3 text-base font-semibold text-gray-900">Opening Hours</h2>
            <div className="space-y-1">
              {schedules.map((schedule) => (
                <div key={schedule.dayOfWeek} className="flex justify-between text-sm">
                  <span className="text-gray-600">{DAY_NAMES[schedule.dayOfWeek]}</span>
                  <span className={schedule.isOpen ? 'text-gray-900 font-medium' : 'text-gray-400'}>
                    {schedule.isOpen ? schedule.openTime + ' - ' + schedule.closeTime : 'Closed'}
                  </span>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="mt-8 text-center">
          <button onClick={handleBookNow}
            className="rounded-md bg-blue-600 px-8 py-3 text-base font-medium text-white hover:bg-blue-700">
            Book an Appointment
          </button>
          <p className="mt-2 text-xs text-gray-400">Powered by Schedulr</p>
        </div>
      </div>
    </main>
  )
}
