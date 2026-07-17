import { prisma } from '@lib/prisma'
import { dispatchReminder } from '../dispatch/notification-dispatcher'
import { evaluateRetry } from '../retry/retry-policy'

const BATCH_SIZE = 20

export interface ProcessorResult {
  found: number
  claimed: number
  sent: number
  failed: number
  retryScheduled: number
  skipped: number
}

export async function findDueReminderIds(now: Date = new Date()): Promise<string[]> {
  const pending = await prisma.reminder.findMany({
    where: { status: 'PENDING', scheduledFor: { lte: now } },
    select: { id: true },
    take: BATCH_SIZE,
    orderBy: { scheduledFor: 'asc' },
  })

  const remaining = BATCH_SIZE - pending.length
  let retryPending: { id: string }[] = []

  if (remaining > 0) {
    retryPending = await prisma.reminder.findMany({
      where: {
        status: 'RETRY_PENDING',
        nextAttemptAt: { lte: now },
      },
      select: { id: true },
      take: remaining,
      orderBy: { nextAttemptAt: 'asc' },
    })
  }

  return [...pending, ...retryPending].map((r) => r.id)
}

export async function claimReminder(reminderId: string): Promise<boolean> {
  const result = await prisma.reminder.updateMany({
    where: {
      id: reminderId,
      status: { in: ['PENDING', 'RETRY_PENDING'] },
    },
    data: {
      status: 'PROCESSING',
      lastAttemptAt: new Date(),
      attemptCount: { increment: 1 },
    },
  })
  return result.count === 1
}

export async function markReminderSent(reminderId: string): Promise<void> {
  await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status: 'SENT',
      sentAt: new Date(),
      failureReason: null,
      nextAttemptAt: null,
    },
  })
}

export async function handleFailureWithRetry(reminderId: string, reason: string): Promise<'RETRY_PENDING' | 'FAILED'> {
  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
    select: { attemptCount: true },
  })

  if (!reminder) return 'FAILED'

  const decision = evaluateRetry(reminder.attemptCount)
  const truncatedReason = reason.slice(0, 500)

  if (decision.retryAllowed && decision.nextAttemptAt) {
    await prisma.reminder.update({
      where: { id: reminderId },
      data: {
        status: 'RETRY_PENDING',
        nextAttemptAt: decision.nextAttemptAt,
        failureReason: truncatedReason,
      },
    })
    return 'RETRY_PENDING'
  }

  await prisma.reminder.update({
    where: { id: reminderId },
    data: {
      status: 'FAILED',
      failureReason: truncatedReason,
      nextAttemptAt: null,
    },
  })
  return 'FAILED'
}

export async function processDueReminders(now: Date = new Date()): Promise<ProcessorResult> {
  const result: ProcessorResult = { found: 0, claimed: 0, sent: 0, failed: 0, retryScheduled: 0, skipped: 0 }

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
        const outcome = await handleFailureWithRetry(reminderId, dispatch.failureReason ?? 'Unknown failure')
        if (outcome === 'RETRY_PENDING') result.retryScheduled++
        else result.failed++
      }
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      const outcome = await handleFailureWithRetry(reminderId, message)
      if (outcome === 'RETRY_PENDING') result.retryScheduled++
      else result.failed++
    }
  }

  return result
}
