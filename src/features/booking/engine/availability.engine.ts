import { prisma } from '@lib/prisma'

export interface AvailabilityWindow {
  openTime: string
  closeTime: string
  breaks: Array<{ startTime: string; endTime: string }>
}

export interface AvailabilityResult {
  isAvailable: boolean
  reason?: string
  window?: AvailabilityWindow
}

function timeToMinutes(time: string): number {
  const [hours, minutes] = time.split(':').map(Number)
  return hours * 60 + minutes
}

function minutesToTime(minutes: number): string {
  const h = Math.floor(minutes / 60).toString().padStart(2, '0')
  const m = (minutes % 60).toString().padStart(2, '0')
  return h + ':' + m
}

export async function checkBusinessAvailability(
  businessId: string,
  date: Date
): Promise<AvailabilityResult> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
  })

  if (!business || business.status !== 'ACTIVE') {
    return { isAvailable: false, reason: 'Business is not active' }
  }

  const now = new Date()
  const requestDate = new Date(date)
  requestDate.setHours(0, 0, 0, 0)

  const today = new Date()
  today.setHours(0, 0, 0, 0)

  if (requestDate < today) {
    return { isAvailable: false, reason: 'Cannot book in the past' }
  }

  const maxDate = new Date(now)
  maxDate.setDate(maxDate.getDate() + business.bookingWindowDays)
  maxDate.setHours(23, 59, 59, 999)

  if (requestDate > maxDate) {
    return { isAvailable: false, reason: 'Date is outside the booking window of ' + business.bookingWindowDays + ' days' }
  }

  const holidayStart = new Date(requestDate)
  const holidayEnd = new Date(requestDate)
  holidayEnd.setHours(23, 59, 59, 999)

  const holiday = await prisma.holiday.findFirst({
    where: {
      businessId,
      date: { gte: holidayStart, lte: holidayEnd },
    },
  })

  if (holiday) {
    return { isAvailable: false, reason: 'Business is closed on this date: ' + holiday.label }
  }

  const dayOfWeek = requestDate.getDay()

  const schedule = await prisma.weeklySchedule.findUnique({
    where: { businessId_dayOfWeek: { businessId, dayOfWeek } },
    include: { breaks: true },
  })

  if (!schedule || !schedule.isOpen) {
    return { isAvailable: false, reason: 'Business is closed on this day' }
  }

  return {
    isAvailable: true,
    window: {
      openTime: schedule.openTime,
      closeTime: schedule.closeTime,
      breaks: schedule.breaks.map((b) => ({
        startTime: b.startTime,
        endTime: b.endTime,
      })),
    },
  }
}

export { timeToMinutes, minutesToTime }
