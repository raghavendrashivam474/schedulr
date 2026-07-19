import { timezoneSchema } from '@lib/validators/timezone.validator'
import { z } from 'zod'

export const createBusinessSchema = z.object({
  name: z.string().min(2).max(100).trim(),
  type: z.string().min(2).max(50).trim(),
  timeZone: timezoneSchema,
  contactEmail: z.string().email().toLowerCase().trim(),
  contactPhone: z.string().max(20).optional(),
  address: z.string().max(200).optional(),
})

export const updateBusinessSchema = createBusinessSchema.partial()

export const businessSettingsSchema = z.object({
  bookingWindowDays: z
    .number().int()
    .min(1, 'Booking window must be at least 1 day')
    .max(365, 'Booking window cannot exceed 365 days')
    .optional(),
  advanceBookingHours: z
    .number().int()
    .min(0, 'Advance booking hours cannot be negative')
    .max(720, 'Advance booking hours cannot exceed 30 days')
    .optional(),
  cancellationHours: z
    .number().int()
    .min(0, 'Cancellation hours cannot be negative')
    .max(720, 'Cancellation hours cannot exceed 30 days')
    .optional(),
  defaultDuration: z
    .number().int()
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration cannot exceed 8 hours')
    .optional(),
})

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>
export type BusinessSettingsInput = z.infer<typeof businessSettingsSchema>
