import { SignJWT, jwtVerify } from 'jose'
import type { SessionPayload } from '@appTypes/index'

const SESSION_DURATION_DAYS = 7
const COOKIE_NAME = 'schedulr_session'

function getSecret(): Uint8Array {
  const secret = process.env.NEXTAUTH_SECRET
  if (!secret) {
    throw new Error('NEXTAUTH_SECRET environment variable is not set')
  }
  return new TextEncoder().encode(secret)
}

export async function createSessionToken(payload: SessionPayload): Promise<string> {
  const secret = getSecret()
  const duration = SESSION_DURATION_DAYS + 'd'

  return new SignJWT({
    userId: payload.userId,
    sessionId: payload.sessionId,
    email: payload.email,
  })
    .setProtectedHeader({ alg: 'HS256' })
    .setIssuedAt()
    .setExpirationTime(duration)
    .sign(secret)
}

export async function verifySessionToken(
  token: string
): Promise<SessionPayload | null> {
  try {
    const secret = getSecret()
    const { payload } = await jwtVerify(token, secret)

    return {
      userId: payload.userId as string,
      sessionId: payload.sessionId as string,
      email: payload.email as string,
      expiresAt: new Date((payload.exp as number) * 1000),
    }
  } catch {
    return null
  }
}

export function getSessionCookieName(): string {
  return COOKIE_NAME
}

export function getSessionDurationSeconds(): number {
  return SESSION_DURATION_DAYS * 24 * 60 * 60
}
