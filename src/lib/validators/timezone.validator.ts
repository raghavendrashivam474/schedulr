import { z } from 'zod'
import { isValidTimezone } from '@lib/time'

export const timezoneSchema = z
  .string()
  .refine((tz) => isValidTimezone(tz), {
    message: 'Invalid IANA timezone. Example: Asia/Kolkata',
  })
