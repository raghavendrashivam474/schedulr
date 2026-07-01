import { prisma } from '@lib/prisma'
import type { WeeklyScheduleInput, HolidayInput } from '../validation'
import type { WeeklySchedule, Holiday } from '@appTypes/index'

const DAYS = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday']

export async function getBusinessIdForUser(userId: string): Promise<string | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  return membership?.businessId ?? null
}

export async function getWeeklySchedule(userId: string): Promise<WeeklySchedule[]> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) return []

  const schedules = await prisma.weeklySchedule.findMany({
    where: { businessId },
    include: { breaks: true },
    orderBy: { dayOfWeek: 'asc' },
  })

  if (schedules.length === 0) {
    return await initializeDefaultSchedule(businessId)
  }

  return schedules
}

async function initializeDefaultSchedule(businessId: string): Promise<WeeklySchedule[]> {
  const defaults = [1,2,3,4,5].map((day) => ({
    businessId,
    dayOfWeek: day,
    isOpen: true,
    openTime: '09:00',
    closeTime: '17:00',
  }))

  const weekendDays = [0,6].map((day) => ({
    businessId,
    dayOfWeek: day,
    isOpen: false,
    openTime: '09:00',
    closeTime: '17:00',
  }))

  await prisma.weeklySchedule.createMany({
    data: [...weekendDays, ...defaults],
  })

  return prisma.weeklySchedule.findMany({
    where: { businessId },
    include: { breaks: true },
    orderBy: { dayOfWeek: 'asc' },
  })
}

export async function updateWeeklySchedule(
  userId: string,
  input: WeeklyScheduleInput
): Promise<WeeklySchedule[]> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  await prisma.$transaction(async (tx) => {
    for (const schedule of input.schedules) {
      const existing = await tx.weeklySchedule.findUnique({
        where: { businessId_dayOfWeek: { businessId, dayOfWeek: schedule.dayOfWeek } },
      })

      if (existing) {
        await tx.break.deleteMany({ where: { weeklyScheduleId: existing.id } })
        await tx.weeklySchedule.update({
          where: { id: existing.id },
          data: {
            isOpen: schedule.isOpen,
            openTime: schedule.openTime,
            closeTime: schedule.closeTime,
            breaks: { create: schedule.breaks },
          },
        })
      } else {
        await tx.weeklySchedule.create({
          data: {
            businessId,
            dayOfWeek: schedule.dayOfWeek,
            isOpen: schedule.isOpen,
            openTime: schedule.openTime,
            closeTime: schedule.closeTime,
            breaks: { create: schedule.breaks },
          },
        })
      }
    }
  })

  return getWeeklySchedule(userId)
}

export async function getHolidays(userId: string): Promise<Holiday[]> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) return []
  return prisma.holiday.findMany({
    where: { businessId },
    orderBy: { date: 'asc' },
  })
}

export async function createHoliday(
  userId: string,
  input: HolidayInput
): Promise<Holiday> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const date = new Date(input.date)

  const existing = await prisma.holiday.findFirst({
    where: { businessId, date },
  })
  if (existing) throw new Error('A holiday already exists on this date')

  return prisma.holiday.create({
    data: { businessId, date, label: input.label },
  })
}

export async function deleteHoliday(
  userId: string,
  holidayId: string
): Promise<void> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const holiday = await prisma.holiday.findFirst({
    where: { id: holidayId, businessId },
  })
  if (!holiday) throw new Error('Holiday not found')

  await prisma.holiday.delete({ where: { id: holidayId } })
}

export { DAYS }
