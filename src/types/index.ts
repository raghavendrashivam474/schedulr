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

// Customer Types
export interface Customer {
  id: string
  businessId: string
  name: string
  email: string
  phone?: string | null
  notes?: string | null
  firstVisit?: Date | null
  lastVisit?: Date | null
  totalVisits: number
  createdAt: Date
  updatedAt: Date
}

export interface CustomerWithHistory extends Customer {
  bookings: BookingWithDetails[]
}

// Booking Types
export type BookingStatus = 'CONFIRMED' | 'CHECKED_IN' | 'IN_PROGRESS' | 'COMPLETED' | 'CANCELLED' | 'NO_SHOW'

export interface Booking {
  id: string
  businessId: string
  serviceId: string
  customerId?: string | null
  customerName: string
  customerEmail: string
  customerPhone?: string | null
  appointmentDate: Date
  startTime: string
  endTime: string
  status: BookingStatus
  notes?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface BookingWithDetails extends Booking {
  service: Service
  business: Business
  customer?: Customer | null
}

// Timeline Types
export interface AppointmentTimeline {
  id: string
  bookingId: string
  customerId?: string | null
  status: BookingStatus
  note?: string | null
  performedBy?: string | null
  createdAt: Date
}

// Slot Types
export interface TimeSlot {
  startTime: string
  endTime: string
  available: boolean
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
