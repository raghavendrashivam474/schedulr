import { prisma } from '@lib/prisma'
import type { CreateBusinessInput, UpdateBusinessInput } from '../validation'
import type { Business, MembershipWithBusiness } from '@appTypes/index'

export async function createBusiness(
  userId: string,
  input: CreateBusinessInput
): Promise<Business> {
  const existingMembership = await prisma.membership.findFirst({
    where: {
      userId,
      role: 'OWNER',
      status: 'ACTIVE',
    },
  })

  if (existingMembership) {
    throw new Error('You already have a registered business')
  }

  const result = await prisma.$transaction(async (tx) => {
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
      data: {
        userId,
        businessId: business.id,
        role: 'OWNER',
        status: 'ACTIVE',
      },
    })

    return business
  })

  return result
}

export async function getBusinessByUserId(
  userId: string
): Promise<Business | null> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      status: 'ACTIVE',
    },
    include: {
      business: true,
    },
  })

  return membership?.business ?? null
}

export async function updateBusiness(
  userId: string,
  input: UpdateBusinessInput
): Promise<Business> {
  const membership = await prisma.membership.findFirst({
    where: {
      userId,
      role: 'OWNER',
      status: 'ACTIVE',
    },
  })

  if (!membership) {
    throw new Error('Business not found or insufficient permissions')
  }

  const business = await prisma.business.update({
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

  return business
}

export async function getUserMemberships(
  userId: string
): Promise<MembershipWithBusiness[]> {
  const memberships = await prisma.membership.findMany({
    where: {
      userId,
      status: 'ACTIVE',
    },
    include: {
      business: true,
    },
  })

  return memberships
}
