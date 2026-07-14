import { prisma } from '@lib/prisma'
import type { ReminderPolicy } from '../types'

export async function getReminderPolicy(businessId: string): Promise<ReminderPolicy> {
  const business = await prisma.business.findUnique({
    where: { id: businessId },
    select: { reminder24h: true, reminder2h: true, reminder30m: true },
  })
  if (!business) {
    return { reminder24h: true, reminder2h: true, reminder30m: false }
  }
  return {
    reminder24h: business.reminder24h,
    reminder2h: business.reminder2h,
    reminder30m: business.reminder30m,
  }
}

export async function updateReminderPolicy(
  userId: string,
  policy: Partial<ReminderPolicy>
): Promise<ReminderPolicy> {
  const membership = await prisma.membership.findFirst({
    where: { userId, role: 'OWNER', status: 'ACTIVE' },
  })
  if (!membership) throw new Error('Business not found')

  const updated = await prisma.business.update({
    where: { id: membership.businessId },
    data: {
      ...(typeof policy.reminder24h === 'boolean' && { reminder24h: policy.reminder24h }),
      ...(typeof policy.reminder2h === 'boolean' && { reminder2h: policy.reminder2h }),
      ...(typeof policy.reminder30m === 'boolean' && { reminder30m: policy.reminder30m }),
    },
    select: { reminder24h: true, reminder2h: true, reminder30m: true },
  })

  return {
    reminder24h: updated.reminder24h,
    reminder2h: updated.reminder2h,
    reminder30m: updated.reminder30m,
  }
}
