import { cookies } from 'next/headers'
import { logoutUser } from '@features/auth/services/auth.service'
import { getSessionCookieName } from '@features/auth/services/session.service'
import { successResponse, serverErrorResponse } from '@utils/api'

export async function POST() {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get(getSessionCookieName())?.value

    if (token) {
      await logoutUser(token)
      cookieStore.delete(getSessionCookieName())
    }

    return successResponse(null, 'Logged out successfully')
  } catch (error) {
    console.error('[LOGOUT]', error)
    return serverErrorResponse()
  }
}