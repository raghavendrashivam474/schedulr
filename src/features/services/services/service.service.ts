import { prisma } from '@lib/prisma'
import type { CreateServiceInput, UpdateServiceInput } from '../validation'
import type { Service } from '@appTypes/index'

export async function getBusinessIdForUser(userId: string): Promise<string | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  return membership?.businessId ?? null
}

export async function createService(
  userId: string,
  input: CreateServiceInput
): Promise<Service> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const existing = await prisma.service.findFirst({
    where: { businessId, name: { equals: input.name, mode: 'insensitive' }, status: 'ACTIVE' },
  })
  if (existing) throw new Error('A service with this name already exists')

  return prisma.service.create({
    data: { businessId, name: input.name, description: input.description, duration: input.duration },
  })
}

export async function getServices(userId: string): Promise<Service[]> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) return []
  return prisma.service.findMany({
    where: { businessId },
    orderBy: [{ status: 'asc' }, { name: 'asc' }],
  })
}

export async function updateService(
  userId: string,
  serviceId: string,
  input: UpdateServiceInput
): Promise<Service> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId },
  })
  if (!service) throw new Error('Service not found')

  if (input.name && input.name !== service.name) {
    const duplicate = await prisma.service.findFirst({
      where: { businessId, name: { equals: input.name, mode: 'insensitive' }, status: 'ACTIVE', NOT: { id: serviceId } },
    })
    if (duplicate) throw new Error('A service with this name already exists')
  }

  return prisma.service.update({
    where: { id: serviceId },
    data: {
      ...(input.name && { name: input.name }),
      ...(input.description !== undefined && { description: input.description }),
      ...(input.duration && { duration: input.duration }),
      ...(input.status && { status: input.status }),
    },
  })
}

export async function deleteService(
  userId: string,
  serviceId: string
): Promise<void> {
  const businessId = await getBusinessIdForUser(userId)
  if (!businessId) throw new Error('Business not found')

  const service = await prisma.service.findFirst({
    where: { id: serviceId, businessId },
  })
  if (!service) throw new Error('Service not found')

  await prisma.service.update({
    where: { id: serviceId },
    data: { status: 'ARCHIVED' },
  })
}
