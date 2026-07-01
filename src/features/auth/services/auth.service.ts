import { prisma } from '@lib/prisma'
import { hashPassword, verifyPassword } from './password.service'
import { createSessionToken } from './session.service'
import type { RegisterInput, LoginInput } from '../validation'
import type { AuthenticatedUser, SessionPayload } from '@appTypes/index'
import { v4 as uuidv4 } from 'uuid'

const SESSION_DURATION_DAYS = 7

export async function registerUser(input: RegisterInput): Promise<{
  user: AuthenticatedUser
  token: string
}> {
  const existingUser = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (existingUser) {
    throw new Error('An account with this email already exists')
  }

  const passwordHash = await hashPassword(input.password)

  const user = await prisma.user.create({
    data: {
      email: input.email,
      name: input.name,
      passwordHash,
    },
  })

  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  const sessionPayload: SessionPayload = {
    userId: user.id,
    sessionId,
    email: user.email,
    expiresAt,
  }

  const token = await createSessionToken(sessionPayload)

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
    },
    token,
  }
}

export async function loginUser(input: LoginInput): Promise<{
  user: AuthenticatedUser
  token: string
}> {
  const user = await prisma.user.findUnique({
    where: { email: input.email },
  })

  if (!user) {
    throw new Error('Invalid email or password')
  }

  if (user.status !== 'ACTIVE') {
    throw new Error('This account has been suspended')
  }

  const isValid = await verifyPassword(input.password, user.passwordHash)

  if (!isValid) {
    throw new Error('Invalid email or password')
  }

  const sessionId = uuidv4()
  const expiresAt = new Date()
  expiresAt.setDate(expiresAt.getDate() + SESSION_DURATION_DAYS)

  const sessionPayload: SessionPayload = {
    userId: user.id,
    sessionId,
    email: user.email,
    expiresAt,
  }

  const token = await createSessionToken(sessionPayload)

  await prisma.session.create({
    data: {
      id: sessionId,
      userId: user.id,
      token,
      expiresAt,
    },
  })

  return {
    user: {
      id: user.id,
      email: user.email,
      name: user.name,
      status: user.status,
    },
    token,
  }
}

export async function logoutUser(token: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { token },
  })
}

export async function getSessionUser(
  token: string
): Promise<AuthenticatedUser | null> {
  const session = await prisma.session.findUnique({
    where: { token },
  })

  if (!session) return null
  if (session.expiresAt < new Date()) {
    await prisma.session.delete({ where: { token } })
    return null
  }

  const user = await prisma.user.findUnique({
    where: { id: session.userId },
  })

  if (!user || user.status !== 'ACTIVE') return null

  return {
    id: user.id,
    email: user.email,
    name: user.name,
    status: user.status,
  }
}
