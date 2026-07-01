import { z } from 'zod'

export const createBusinessSchema = z.object({
  name: z
    .string()
    .min(2, 'Business name must be at least 2 characters')
    .max(100, 'Business name must be less than 100 characters')
    .trim(),
  type: z
    .string()
    .min(2, 'Business type must be at least 2 characters')
    .max(50, 'Business type must be less than 50 characters')
    .trim(),
  timeZone: z
    .string()
    .min(1, 'Time zone is required'),
  contactEmail: z
    .string()
    .email('Please enter a valid contact email')
    .toLowerCase()
    .trim(),
  contactPhone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .optional(),
  address: z
    .string()
    .max(200, 'Address must be less than 200 characters')
    .optional(),
})

export const updateBusinessSchema = createBusinessSchema.partial()

export type CreateBusinessInput = z.infer<typeof createBusinessSchema>
export type UpdateBusinessInput = z.infer<typeof updateBusinessSchema>