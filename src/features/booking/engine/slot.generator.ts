import { timeToMinutes, minutesToTime } from './availability.engine'
import type { TimeSlot } from '@appTypes/index'

export interface SlotGeneratorInput {
  openTime: string
  closeTime: string
  duration: number
  breaks: Array<{ startTime: string; endTime: string }>
  existingBookings: Array<{ startTime: string; endTime: string }>
  advanceBookingMinutes: number
  isToday: boolean
  currentTimeMinutes?: number
}

function isInBreak(
  slotStart: number,
  slotEnd: number,
  breaks: Array<{ startTime: string; endTime: string }>
): boolean {
  return breaks.some((b) => {
    const breakStart = timeToMinutes(b.startTime)
    const breakEnd = timeToMinutes(b.endTime)
    return slotStart < breakEnd && slotEnd > breakStart
  })
}

function isBooked(
  slotStart: number,
  slotEnd: number,
  bookings: Array<{ startTime: string; endTime: string }>
): boolean {
  return bookings.some((b) => {
    const bookingStart = timeToMinutes(b.startTime)
    const bookingEnd = timeToMinutes(b.endTime)
    return slotStart < bookingEnd && slotEnd > bookingStart
  })
}

export function generateSlots(input: SlotGeneratorInput): TimeSlot[] {
  const {
    openTime,
    closeTime,
    duration,
    breaks,
    existingBookings,
    advanceBookingMinutes,
    isToday,
    currentTimeMinutes = 0,
  } = input

  const openMinutes = timeToMinutes(openTime)
  const closeMinutes = timeToMinutes(closeTime)
  const slots: TimeSlot[] = []

  let current = openMinutes

  while (current + duration <= closeMinutes) {
    const slotEnd = current + duration
    const slotStartTime = minutesToTime(current)
    const slotEndTime = minutesToTime(slotEnd)

    let available = true

    if (isInBreak(current, slotEnd, breaks)) {
      available = false
    }

    if (isBooked(current, slotEnd, existingBookings)) {
      available = false
    }

    if (isToday && current < currentTimeMinutes + advanceBookingMinutes) {
      available = false
    }

    slots.push({
      startTime: slotStartTime,
      endTime: slotEndTime,
      available,
    })

    current += duration
  }

  return slots
}
