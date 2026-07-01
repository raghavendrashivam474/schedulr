// User Types
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

// Business Types
export type BusinessStatus = 'ACTIVE' | 'INACTIVE' | 'SUSPENDED'

export interface Business {
  id: string
  name: string
  type: string
  timeZone: string
  contactEmail: string
  contactPhone?: string | null
  address?: string | null
  bookingWindowDays: number
  advanceBookingHours: number
  cancellationHours: number
  defaultDuration: number
  status: BusinessStatus
  createdAt: Date
  updatedAt: Date
}

// Membership Types
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

// Session Types
export interface Session {
  id: string
  userId: string
  token: string
  expiresAt: Date
  createdAt: Date
}

// Service Types
export type ServiceStatus = 'ACTIVE' | 'ARCHIVED'

export interface Service {
  id: string
  businessId: string
  name: string
  description?: string | null
  duration: number
  status: ServiceStatus
  createdAt: Date
  updatedAt: Date
}

// Schedule Types
export interface Break {
  id: string
  weeklyScheduleId: string
  startTime: string
  endTime: string
  label?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface WeeklySchedule {
  id: string
  businessId: string
  dayOfWeek: number
  isOpen: boolean
  openTime: string
  closeTime: string
  breaks: Break[]
  createdAt: Date
  updatedAt: Date
}

// Holiday Types
export interface Holiday {
  id: string
  businessId: string
  date: Date
  label: string
  createdAt: Date
  updatedAt: Date
}

// API Response Types
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

// Auth Types
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
