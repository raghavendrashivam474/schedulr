import DashboardLayout from '@components/dashboard/DashboardLayout'

const STATS = [
  { label: 'Total Bookings', value: '-', note: 'Coming in Sprint 2' },
  { label: 'Active Services', value: '-', note: 'Coming in Sprint 2' },
  { label: 'Customers', value: '-', note: 'Coming in Sprint 2' },
]

const STEPS = [
  { step: '1', label: 'Create your account', done: true },
  { step: '2', label: 'Set up your business profile', done: true },
  { step: '3', label: 'Add your services', done: false },
  { step: '4', label: 'Configure availability', done: false },
  { step: '5', label: 'Accept your first booking', done: false },
]

export default function OverviewPage() {
  return (
    <DashboardLayout>
      <div className="max-w-4xl">
        <h1 className="text-2xl font-bold text-gray-900">Overview</h1>
        <p className="mt-1 text-sm text-gray-600">
          Welcome to your Schedulr dashboard.
        </p>

        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {STATS.map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm"
            >
              <p className="text-sm font-medium text-gray-500">{stat.label}</p>
              <p className="mt-2 text-3xl font-bold text-gray-900">{stat.value}</p>
              <p className="mt-1 text-xs text-gray-400">{stat.note}</p>
            </div>
          ))}
        </div>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <h2 className="text-base font-semibold text-gray-900">Getting started</h2>
          <div className="mt-4 space-y-3">
            {STEPS.map((item) => (
              <div key={item.step} className="flex items-center gap-3">
                <div
                  className={item.done
                    ? 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-green-100 text-green-700'
                    : 'flex h-6 w-6 items-center justify-center rounded-full text-xs font-bold bg-gray-100 text-gray-400'}
                >
                  {item.done ? 'v' : item.step}
                </div>
                <span
                  className={item.done ? 'text-sm text-gray-500 line-through' : 'text-sm text-gray-700'}
                >
                  {item.label}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </DashboardLayout>
  )
}
