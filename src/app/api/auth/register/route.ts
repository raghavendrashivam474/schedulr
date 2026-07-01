import { type NextRequest } from 'next/server'
import { registerSchema } from '@features/auth/validation'
import { registerUser } from '@features/auth/services/auth.service'
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

    const parsed = registerSchema.safeParse(body)

    if (!parsed.success) {
      const details = Object.fromEntries(
        Object.entries(parsed.error.flatten().fieldErrors).map(([k, v]) => [
          k,
          v ?? [],
        ])
      )
      return validationErrorResponse(details)
    }

    const { user, token } = await registerUser(parsed.data)

    const cookieStore = await cookies()
    cookieStore.set(getSessionCookieName(), token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: getSessionDurationSeconds(),
      path: '/',
    })

    return successResponse(
      { user },
      'Account created successfully',
      201
    )
  } catch (error) {
    if (error instanceof Error) {
      if (error.message.includes('already exists')) {
        return errorResponse(error.message, 409)
      }
    }
    console.error('[REGISTER]', error)
    return serverErrorResponse()
  }
}