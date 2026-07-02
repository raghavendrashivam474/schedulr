import { type NextRequest, NextResponse } from 'next/server'
import { verifySessionToken } from './features/auth/services/session.service'

const COOKIE_NAME = 'schedulr_session'
const AUTH_ROUTES = ['/login', '/register']
const PROTECTED_PREFIXES = [
  '/overview', '/business', '/settings', '/services',
  '/availability', '/bookings', '/customers',
]

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get(COOKIE_NAME)?.value

  const isAuthRoute = AUTH_ROUTES.includes(pathname)
  const isProtectedRoute = PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))

  let isAuthenticated = false
  if (token) {
    const payload = await verifySessionToken(token)
    isAuthenticated = payload !== null
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL('/overview', request.url))
  }

  if (isProtectedRoute && !isAuthenticated) {
    const loginUrl = new URL('/login', request.url)
    loginUrl.searchParams.set('redirect', pathname)
    return NextResponse.redirect(loginUrl)
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico|public).*)'],
}
