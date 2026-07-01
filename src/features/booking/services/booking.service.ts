import { prisma } from '@lib/prisma'
import { checkBusinessAvailability, timeToMinutes, minutesToTime } from '../engine/availability.engine'
import { generateSlots } from '../engine/slot.generator'
import type { CreateBookingInput, UpdateBookingInput, GetSlotsInput } from '../validation'
import type { Booking, BookingWithDetails, TimeSlot } from '@appTypes/index'

export async function getAvailableSlots(input: GetSlotsInput): Promise<TimeSlot[]> {
  const { businessId, serviceId, date } = input

  const requestDate = new Date(date + 'T00:00:00')

  const availability = await checkBusinessAvailability(businessId, requestDate)
  if (!availability.isAvailable || !availability.window) {
    return []
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId, status: 'ACTIVE' },
  })

  if (!service) return []

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  })

  if (!business) return []

  const dateStart = new Date(date + 'T00:00:00')
  const dateEnd = new Date(date + 'T23:59:59')

  const existingBookings = await prisma.booking.findMany({
    where: {
      businessId,
      appointmentDate: { gte: dateStart, lte: dateEnd },
      status: { in: ['CONFIRMED'] },
    },
    select: { startTime: true, endTime: true },
  })

  const now = new Date()
  const isToday = requestDate.toDateString() === now.toDateString()
  const currentTimeMinutes = isToday
    ? now.getHours() * 60 + now.getMinutes()
    : 0

  return generateSlots({
    openTime: availability.window.openTime,
    closeTime: availability.window.closeTime,
    duration: service.duration,
    breaks: availability.window.breaks,
    existingBookings,
    advanceBookingMinutes: business.advanceBookingHours * 60,
    isToday,
    currentTimeMinutes,
  })
}

export async function createBooking(
  input: CreateBookingInput
): Promise<BookingWithDetails> {
  const { businessId, serviceId, appointmentDate, startTime } = input

  const availability = await checkBusinessAvailability(businessId, new Date(appointmentDate + 'T00:00:00'))
  if (!availability.isAvailable) {
    throw new Error(availability.reason ?? 'Business is not available on this date')
  }

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId, status: 'ACTIVE' },
  })

  if (!service) {
    throw new Error('Service not found or not active')
  }

  const startMinutes = timeToMinutes(startTime)
  const endMinutes = startMinutes + service.duration
  const endTime = minutesToTime(endMinutes)

  const business = await prisma.business.findUnique({
    where: { id: businessId },
  })

  if (!business) throw new Error('Business not found')

  const advanceMinutes = business.advanceBookingHours * 60
  const now = new Date()
  const requestDateTime = new Date(appointmentDate + 'T' + startTime + ':00')
  const diffMinutes = (requestDateTime.getTime() - now.getTime()) / 60000

  if (diffMinutes < advanceMinutes) {
    throw new Error('Booking requires at least ' + business.advanceBookingHours + ' hours advance notice')
  }

  if (availability.window) {
    const openMinutes = timeToMinutes(availability.window.openTime)
    const closeMinutes = timeToMinutes(availability.window.closeTime)
    if (startMinutes < openMinutes || endMinutes > closeMinutes) {
      throw new Error('Requested time is outside business hours')
    }
    const inBreak = availability.window.breaks.some((b) => {
      const bStart = timeToMinutes(b.startTime)
      const bEnd = timeToMinutes(b.endTime)
      return startMinutes < bEnd && endMinutes > bStart
    })
    if (inBreak) throw new Error('Requested time falls within a break period')
  }

  const dateStart = new Date(appointmentDate + 'T00:00:00')
  const dateEnd = new Date(appointmentDate + 'T23:59:59')

  const conflict = await prisma.booking.findFirst({
    where: {
      businessId,
      appointmentDate: { gte: dateStart, lte: dateEnd },
      status: 'CONFIRMED',
      OR: [
        { startTime: { lte: startTime }, endTime: { gt: startTime } },
        { startTime: { lt: endTime }, endTime: { gte: endTime } },
        { startTime: { gte: startTime }, endTime: { lte: endTime } },
      ],
    },
  })

  if (conflict) {
    throw new Error('This time slot is no longer available')
  }

  const booking = await prisma.booking.create({
    data: {
      businessId,
      serviceId,
      customerName: input.customerName,
      customerEmail: input.customerEmail,
      customerPhone: input.customerPhone,
      appointmentDate: new Date(appointmentDate + 'T00:00:00'),
      startTime,
      endTime,
      notes: input.notes,
      status: 'CONFIRMED',
    },
    include: { service: true, business: true },
  })

  return booking
}

export async function getBookings(
  userId: string,
  filters?: { status?: string; date?: string }
): Promise<BookingWithDetails[]> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return []

  const where: Record<string, unknown> = { businessId: membership.businessId }

  if (filters?.status) where.status = filters.status

  if (filters?.date) {
    const dateStart = new Date(filters.date + 'T00:00:00')
    const dateEnd = new Date(filters.date + 'T23:59:59')
    where.appointmentDate = { gte: dateStart, lte: dateEnd }
  }

  return prisma.booking.findMany({
    where,
    include: { service: true, business: true },
    orderBy: [{ appointmentDate: 'asc' }, { startTime: 'asc' }],
  })
}

export async function getBookingById(
  bookingId: string,
  userId: string
): Promise<BookingWithDetails | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return null

  return prisma.booking.findFirst({
    where: { id: bookingId, businessId: membership.businessId },
    include: { service: true, business: true },
  })
}

export async function updateBookingStatus(
  bookingId: string,
  userId: string,
  input: UpdateBookingInput
): Promise<Booking> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId: membership.businessId },
  })
  if (!booking) throw new Error('Booking not found')

  if (booking.status === 'CANCELLED') {
    throw new Error('Cannot update a cancelled booking')
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: input.status },
  })
}

export async function cancelBooking(
  bookingId: string,
  userId: string
): Promise<Booking> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const booking = await prisma.booking.findFirst({
    where: { id: bookingId, businessId: membership.businessId },
  })
  if (!booking) throw new Error('Booking not found')

  if (booking.status === 'CANCELLED') {
    throw new Error('Booking is already cancelled')
  }

  const business = await prisma.business.findUnique({
    where: { id: membership.businessId },
  })

  if (business) {
    const cancellationDeadline = new Date(booking.appointmentDate)
    cancellationDeadline.setHours(cancellationDeadline.getHours() - business.cancellationHours)
    if (new Date() > cancellationDeadline) {
      throw new Error('Cancellation window has passed. Cannot cancel within ' + business.cancellationHours + ' hours of appointment')
    }
  }

  return prisma.booking.update({
    where: { id: bookingId },
    data: { status: 'CANCELLED' },
  })
}
