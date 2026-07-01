import { z } from 'zod'

const timeRegex = /^([01]\d|2[0-3]):([0-5]\d)$/

export const breakSchema = z.object({
  startTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:MM'),
  endTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:MM'),
  label: z.string().max(50).optional(),
})

export const dayScheduleSchema = z.object({
  dayOfWeek: z.number().int().min(0).max(6),
  isOpen: z.boolean(),
  openTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:MM'),
  closeTime: z.string().regex(timeRegex, 'Invalid time format. Use HH:MM'),
  breaks: z.array(breakSchema).default([]),
})

export const weeklyScheduleSchema = z.object({
  schedules: z.array(dayScheduleSchema).min(1),
})

export const holidaySchema = z.object({
  date: z.string().regex(/^\d{4}-\d{2}-\d{2}$/, 'Date must be in YYYY-MM-DD format'),
  label: z.string().min(1, 'Label is required').max(100),
})

export type DayScheduleInput = z.infer<typeof dayScheduleSchema>
export type WeeklyScheduleInput = z.infer<typeof weeklyScheduleSchema>
export type HolidayInput = z.infer<typeof holidaySchema>
export type BreakInput = z.infer<typeof breakSchema>
