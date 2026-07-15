// Appointment Change Types
export type AppointmentChangeType = 'RESCHEDULED'

export interface AppointmentChange {
  id: string
  bookingId: string
  type: AppointmentChangeType
  oldAppointmentDate: Date
  oldStartTime: string
  oldEndTime: string
  newAppointmentDate: Date
  newStartTime: string
  newEndTime: string
  reason?: string | null
  changedByUserId?: string | null
  createdAt: Date
}

// Rescheduling Types
export interface RescheduleRequest {
  bookingId: string
  newAppointmentDate: string
  newStartTime: string
  reason?: string
}

export type RescheduleFailureReason =
  | 'APPOINTMENT_NOT_FOUND'
  | 'APPOINTMENT_NOT_RESCHEDULABLE'
  | 'SERVICE_UNAVAILABLE'
  | 'OUTSIDE_BUSINESS_HOURS'
  | 'HOLIDAY'
  | 'APPOINTMENT_CONFLICT'
  | 'BOOKING_POLICY_VIOLATION'
  | 'INVALID_START_TIME'
  | 'NO_OP'
  | 'BREAK_CONFLICT'
  | 'BUSINESS_UNAVAILABLE'

export type RescheduleValidationResult =
  | { valid: true }
  | { valid: false; reason: RescheduleFailureReason; message: string }
