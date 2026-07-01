import { z } from 'zod'

export const createServiceSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').max(100).trim(),
  description: z.string().max(500).optional(),
  duration: z
    .number()
    .int('Duration must be a whole number')
    .min(5, 'Duration must be at least 5 minutes')
    .max(480, 'Duration cannot exceed 8 hours'),
})

export const updateServiceSchema = createServiceSchema.partial().extend({
  status: z.enum(['ACTIVE', 'ARCHIVED']).optional(),
})

export type CreateServiceInput = z.infer<typeof createServiceSchema>
export type UpdateServiceInput = z.infer<typeof updateServiceSchema>
