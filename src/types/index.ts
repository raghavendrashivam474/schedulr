// ─────────────────────────────────────────────
// User Types
// ─────────────────────────────────────────────

export type UserStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface User {
  id: string
  email: string
  name: string
  status: UserStatus
  createdAt: Date
  updatedAt: Date
}

export interface UserWithPassword extends User {
  passwordHash: string
}

// ─────────────────────────────────────────────
// Business Types
// ─────────────────────────────────────────────

export type BusinessStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface Business {
  id: string
  name: string
  type: string
  timeZone: string
  contactEmail: string
  contactPhone?: string | null
  address?: string | null
  status: BusinessStatus
  createdAt: Date
  updatedAt: Date
}

// ─────────────────────────────────────────────
// Membership Types
// ─────────────────────────────────────────────

export type MembershipRole = 'OWNER' | 'MANAGER' | 'STAFF' | 'RECEPTIONIST'
export type MembershipStatus = 'ACTIVE' | 'INACTIVE' | 'INVITED'

export interface Membership {
  id: string
  userId: string
  businessId: string
  role: MembershipRole
  status: MembershipStatus
  createdAt: Date
  updatedAt: Date
}

export interface MembershipWithBusiness extends Membership {
  business: Business
}

// ─────────────────────────────────────────────
// Session Types
// ─────────────────────────────────────────────

export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

// ─────────────────────────────────────────────
// API Response Types
// ─────────────────────────────────────────────

export interface ApiSuccess<T = unknown> {
  success: true
  data: T
  message?: string
}

export interface ApiError {
  success: false
  error: string
  details?: Record<string, string[]>
}

export type ApiResponse<T = unknown> = ApiSuccess<T> | ApiError

// ─────────────────────────────────────────────
// Auth Types
// ─────────────────────────────────────────────

export interface AuthenticatedUser {
  id: string
  email: string
  name: string
  status: UserStatus
}

export interface SessionPayload {
  userId: string
  sessionId: string
  email: string
  expiresAt: Date
}