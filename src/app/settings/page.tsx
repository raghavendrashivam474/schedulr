import DashboardLayout from '@components/dashboard/DashboardLayout'

export default function SettingsPage() {
  return (
    <DashboardLayout>
      <div className="max-w-2xl">
        <h1 className="text-2xl font-bold text-gray-900">Settings</h1>
        <p className="mt-1 text-sm text-gray-600">
          Manage your account settings.
        </p>

        <div className="mt-8 rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
          <p className="text-sm text-gray-500">
            Account settings will be available in Sprint 2.
          </p>
        </div>
      </div>
    </DashboardLayout>
  )
}