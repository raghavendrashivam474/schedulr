import { prisma } from '@lib/prisma'
import type { UpdateBusinessInput, BusinessSettingsInput } from '../validation'
import type { Business } from '@appTypes/index'

export async function createBusiness(
  userId: string,
  input: UpdateBusinessInput & { name: string; type: string; timeZone: string; contactEmail: string }
): Promise<Business> {
  const existingMembership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (existingMembership) throw new Error('You already have a registered business')

  return prisma.$transaction(async (tx) => {
    const business = await tx.business.create({
      data: {
        name: input.name,
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

export async function getBusinessByUserId(userId: string): Promise<Business | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
    include: { business: true },
  })
  return membership?.business ?? null
}

export async function updateBusiness(
  userId: string,
  input: UpdateBusinessInput
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found or insufficient permissions')

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
  input: BusinessSettingsInput
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found or insufficient permissions')

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
