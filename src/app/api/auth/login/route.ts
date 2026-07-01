import { type NextRequest } from 'next/server'
import { loginSchema } from '@features/auth/validation'
import { loginUser } from '@features/auth/services/auth.service'
import { getSessionCookieName, getSessionDurationSeconds } from '@features/auth/services/session.service'
import {
  successResponse,
  errorResponse,
  validationErrorResponse,
  serverErrorResponse,
} from '@utils/api'
import { cookies } from 'next/headers'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    const parsed = loginSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v ?? [],
        ])
      )
      return validationErrorResponse(details)
    }

    const { user, token } = await loginUser(parsed.data)

    const cookieStore = await cookies()
    cookieStore.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getSessionDurationSeconds(),
      path: '/',
    })

    return successResponse({ user }, 'Login successful')
  } catch (error) {
    if (error instanceof Error) {
      if (
        error.message.includes('Invalid email') ||
        error.message.includes('suspended')
      ) {
        return errorResponse(error.message, 401)
      }
    }
    console.error('[LOGIN]', error)
    return serverErrorResponse()
  }
}