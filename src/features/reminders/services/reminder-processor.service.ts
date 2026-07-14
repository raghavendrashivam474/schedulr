import { prisma } from '@lib/prisma'
import { dispatchReminder } from '../dispatch/notification-dispatcher'

const BATCH_SIZE = 20

export interface ProcessorResult {
  found: number
  claimed: number
  sent: number
  failed: number
  skipped: number
}

export async function findDueReminderIds(now: Date = new Date()): Promise<string[]> {
  const reminders = await prisma.reminder.findMany({
    where: { status: 'PENDING', scheduledFor: { lte: now } },
    select: { id: true },
    take: BATCH_SIZE,
    orderBy: { scheduledFor: 'asc' },
  })
  return reminders.map((r) => r.id)
}

export async function claimReminder(reminderId: string): Promise<boolean> {
  const result = await prisma.reminder.updateMany({
    where: { id: reminderId, status: 'PENDING' },
    data: { status: 'PROCESSING' },
  })
  return result.count === 1
}

export async function markReminderSent(reminderId: string): Promise<void> {
  await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: 'SENT', sentAt: new Date() },
  })
}

export async function markReminderFailed(reminderId: string, reason: string): Promise<void> {
  await prisma.reminder.update({
    where: { id: reminderId },
    data: { status: 'FAILED', failureReason: reason.slice(0, 500) },
  })
}

export async function processDueReminders(now: Date = new Date()): Promise<ProcessorResult> {
  const result: ProcessorResult = { found: 0, claimed: 0, sent: 0, failed: 0, skipped: 0 }

  const dueIds = await findDueReminderIds(now)
  result.found = dueIds.length

  for (const reminderId of dueIds) {
    const claimed = await claimReminder(reminderId)
    if (!claimed) {
      result.skipped++
      continue
    }
    result.claimed++

    try {
      const dispatch = await dispatchReminder(reminderId)
      if (dispatch.success) {
        await markReminderSent(reminderId)
        result.sent++
      } else {
        await markReminderFailed(reminderId, dispatch.failureReason ?? 'Unknown failure')
        result.failed++
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      await markReminderFailed(reminderId, message)
      result.failed++
    }
  }

  return result
}
