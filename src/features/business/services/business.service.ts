import { prisma } from '@lib/prisma'
import slugify from 'slugify'
import type { Business } from '@appTypes/index'

export async function generateSlug(name: string, businessId?: string): Promise<string> {
  let base = slugify(name, { lower: true, strict: true, trim: true })
  if (!base) base = 'business'

  let slug = base
  let counter = 0

  while (true) {
    const existing = await prisma.business.findUnique({
      where: { slug },
    })

    if (!existing || existing.id === businessId) {
      return slug
    }

    counter++
    slug = base + '-' + counter
  }
}

export async function updateBusinessSlug(
  userId: string,
  slug: string
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const normalised = slugify(slug, { lower: true, strict: true, trim: true })
  if (!normalised) throw new Error('Invalid slug')

  const existing = await prisma.business.findUnique({
    where: { slug: normalised },
  })

  if (existing && existing.id !== membership.businessId) {
    throw new Error('This URL is already taken. Please choose another.')
  }

  return prisma.business.update({
    where: { id: membership.businessId },
    data: { slug: normalised },
  })
}

export async function updateBusinessProfile(
  userId: string,
  data: {
    name?: string
    type?: string
    description?: string
    contactEmail?: string
    contactPhone?: string
    address?: string
    website?: string
    instagram?: string
    facebook?: string
    timeZone?: string
  }
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  return prisma.business.update({
    where: { id: membership.businessId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.type && { type: data.type }),
      ...(data.description !== undefined && { description: data.description }),
      ...(data.contactEmail && { contactEmail: data.contactEmail }),
      ...(data.contactPhone !== undefined && { contactPhone: data.contactPhone }),
      ...(data.address !== undefined && { address: data.address }),
      ...(data.website !== undefined && { website: data.website }),
      ...(data.instagram !== undefined && { instagram: data.instagram }),
      ...(data.facebook !== undefined && { facebook: data.facebook }),
      ...(data.timeZone && { timeZone: data.timeZone }),
    },
  })
}

export async function updateBusinessBranding(
  userId: string,
  data: { logoUrl?: string; coverImageUrl?: string }
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  return prisma.business.update({
    where: { id: membership.businessId },
    data: {
      ...(data.logoUrl !== undefined && { logoUrl: data.logoUrl }),
      ...(data.coverImageUrl !== undefined && { coverImageUrl: data.coverImageUrl }),
    },
  })
}

export async function getPublicBusinessBySlug(slug: string) {
  const business = await prisma.business.findUnique({
    where: { slug, status: 'ACTIVE' },
  })
  if (!business) return null

  const services = await prisma.service.findMany({
    where: { businessId: business.id, status: 'ACTIVE' },
    orderBy: { name: 'asc' },
  })

  const schedules = await prisma.weeklySchedule.findMany({
    where: { businessId: business.id },
    include: { breaks: true },
    orderBy: { dayOfWeek: 'asc' },
  })

  return { business, services, schedules }
}

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { business: true },
  })
  return membership?.business ?? null
}

export async function createBusiness(
  userId: string,
  input: { name: string; type: string; timeZone: string; contactEmail: string; contactPhone?: string; address?: string }
): Promise<Business> {
  const existingMembership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (existingMembership) throw new Error('You already have a registered business')

  const slug = await generateSlug(input.name)

  return prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: input.name,
        slug,
        type: input.type,
        timeZone: input.timeZone,
        contactEmail: input.contactEmail,
        contactPhone: input.contactPhone,
        address: input.address,
      },
    })
    await tx.membership.create({
      data: { userId, businessId: business.id, role: 'OWNER', status: 'ACTIVE' },
    })
    return business
  })
}

export async function updateBusiness(
  userId: string,
  input: Partial<{ name: string; type: string; timeZone: string; contactEmail: string; contactPhone: string; address: string }>
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  return prisma.business.update({
    where: { id: membership.businessId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.type && { type: input.type }),
      ...(input.timeZone && { timeZone: input.timeZone }),
      ...(input.contactEmail && { contactEmail: input.contactEmail }),
      ...(input.contactPhone !== undefined && { contactPhone: input.contactPhone }),
      ...(input.address !== undefined && { address: input.address }),
    },
  })
}

export async function updateBusinessSettings(
  userId: string,
  input: Partial<{ bookingWindowDays: number; advanceBookingHours: number; cancellationHours: number; defaultDuration: number }>
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  return prisma.business.update({
    where: { id: membership.businessId },
    data: {
      ...(input.bookingWindowDays !== undefined && { bookingWindowDays: input.bookingWindowDays }),
      ...(input.advanceBookingHours !== undefined && { advanceBookingHours: input.advanceBookingHours }),
      ...(input.cancellationHours !== undefined && { cancellationHours: input.cancellationHours }),
      ...(input.defaultDuration !== undefined && { defaultDuration: input.defaultDuration }),
    },
  })
}
