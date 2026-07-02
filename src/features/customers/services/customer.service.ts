import { prisma } from '@lib/prisma'
import type { Customer } from '@appTypes/index'

export async function findOrCreateCustomer(
  businessId: string,
  data: {
    name: string
    email: string
    phone?: string | null
  }
): Promise<Customer> {
  const existing = await prisma.customer.findUnique({
    where: { businessId_email: { businessId, email: data.email.toLowerCase() } },
  })

  if (existing) {
    return prisma.customer.update({
      where: { id: existing.id },
      data: {
        name: data.name,
        phone: data.phone ?? existing.phone,
      },
    })
  }

  return prisma.customer.create({
    data: {
      businessId,
      name: data.name,
      email: data.email.toLowerCase(),
      phone: data.phone,
    },
  })
}

export async function getCustomers(
  userId: string,
  search?: string
): Promise<Customer[]> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return []

  return prisma.customer.findMany({
    where: {
      businessId: membership.businessId,
      ...(search && {
        OR: [
          { name: { contains: search, mode: 'insensitive' } },
          { email: { contains: search, mode: 'insensitive' } },
        ],
      }),
    },
    orderBy: { lastVisit: 'desc' },
  })
}

export async function getCustomerById(
  userId: string,
  customerId: string
): Promise<Customer | null> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) return null

  return prisma.customer.findFirst({
    where: { id: customerId, businessId: membership.businessId },
  })
}

export async function updateCustomer(
  userId: string,
  customerId: string,
  data: { name?: string; phone?: string; notes?: string }
): Promise<Customer> {
  const membership = await prisma.membership.findFirst({
    where: { userId, status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const customer = await prisma.customer.findFirst({
    where: { id: customerId, businessId: membership.businessId },
  })
  if (!customer) throw new Error('Customer not found')

  return prisma.customer.update({
    where: { id: customerId },
    data: {
      ...(data.name && { name: data.name }),
      ...(data.phone !== undefined && { phone: data.phone }),
      ...(data.notes !== undefined && { notes: data.notes }),
    },
  })
}

export async function getCustomerHistory(customerId: string) {
  return prisma.booking.findMany({
    where: { customerId },
    include: { service: true },
    orderBy: { appointmentDate: 'desc' },
  })
}

export async function updateCustomerStats(
  customerId: string,
  appointmentDate: Date
): Promise<void> {
  const customer = await prisma.customer.findUnique({
    where: { id: customerId },
  })
  if (!customer) return

  await prisma.customer.update({
    where: { id: customerId },
    data: {
      totalVisits: { increment: 1 },
      lastVisit: appointmentDate,
      firstVisit: customer.firstVisit ?? appointmentDate,
    },
  })
}
