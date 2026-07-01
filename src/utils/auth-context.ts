import { cookies } from 'next/headers'
import { getSessionUser } from '@features/auth/services/auth.service'
import { getSessionCookieName } from '@features/auth/services/session.service'
import type { AuthenticatedUser } from '@appTypes/index'

export async function getAuthenticatedUser(): Promise<AuthenticatedUser | null> {
  const cookieStore = await cookies()
  const token = cookieStore.get(getSessionCookieName())?.value

  if (!token) return null

  return getSessionUser(token)
}

export async function requireAuth(): Promise<AuthenticatedUser> {
  const user = await getAuthenticatedUser()

  if (!user) {
    throw new Error('UNAUTHORIZED')
  }

  return user
}
