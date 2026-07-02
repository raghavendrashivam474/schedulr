import Link from 'next/link'

const NAV_ITEMS = [
  { label: 'Overview', href: '/overview' },
  { label: 'Bookings', href: '/bookings' },
  { label: 'Customers', href: '/customers' },
  { label: 'Services', href: '/services' },
  { label: 'Availability', href: '/availability' },
  { label: 'Business', href: '/business' },
  { label: 'Settings', href: '/settings' },
  { label: 'Profile', href: '/settings/profile' },
  { label: 'Share', href: '/settings/share' },
]

export default function DashboardLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <div className="flex min-h-screen bg-gray-50">
      <aside className="w-64 border-r border-gray-200 bg-white">
        <div className="border-b border-gray-200 px-6 py-5">
          <span className="text-lg font-bold text-gray-900">Schedulr</span>
        </div>
        <nav className="p-4">
          <ul className="space-y-1">
            {NAV_ITEMS.map((item) => (
              <li key={item.href}>
                <Link href={item.href}
                  className="block rounded-md px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-100 hover:text-gray-900">
                  {item.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      </aside>
      <div className="flex flex-1 flex-col">
        <header className="border-b border-gray-200 bg-white px-8 py-4">
          <div className="flex items-center justify-between">
            <div />
            <LogoutButton />
          </div>
        </header>
        <main className="flex-1 px-8 py-8">{children}</main>
      </div>
    </div>
  )
}

function LogoutButton() {
  return (
    <form action="/api/auth/logout" method="POST">
      <button type="submit" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign out</button>
    </form>
  )
}
