// JobWorker
// Polls the queue, claims jobs, dispatches them, persists results.
// Contains zero business logic.
// Business logic belongs exclusively in handlers.

import type { IJobWorker, WorkerRunResult } from '../contracts/JobWorker'
import type { IJobQueue } from '../contracts/JobQueue'
import type { InMemoryQueue } from '../queue/InMemoryQueue'
import type { JobDispatcher } from './JobDispatcher'
import { evaluateRetry } from '@features/reminders/retry/retry-policy'

const BATCH_SIZE = 20

export class JobWorker implements IJobWorker {
  constructor(
    private readonly queue: IJobQueue,
    private readonly dispatcher: JobDispatcher
  ) {}

  async run(now: Date = new Date()): Promise<WorkerRunResult> {
    const result: WorkerRunResult = {
      found: 0,
      claimed: 0,
      completed: 0,
      failed: 0,
      retryScheduled: 0,
      skipped: 0,
    }

    const jobs = await (this.queue as unknown as InMemoryQueue).dequeue(BATCH_SIZE, now)
    result.found = jobs.length

    for (const job of jobs) {
      const claimed = await this.queue.claim(job.id)
      if (!claimed) {
        result.skipped++
        continue
      }
      result.claimed++

      // Read the updated job from the queue after claiming
      // so attemptCount reflects the increment applied during claim.
      const snapshot = (this.queue as unknown as InMemoryQueue)
        .snapshot()
        .find((j) => j.id === job.id)
      const attemptCount = snapshot?.attemptCount ?? job.attemptCount + 1

      try {
        const execution = await this.dispatcher.dispatch(job)

        if (execution.success) {
          await this.queue.markCompleted(job.id)
          result.completed++
        } else {
          const isRetryable = execution.retryable !== false
          const belowMaxAttempts = attemptCount < job.maxAttempts

          if (isRetryable && belowMaxAttempts) {
            const retryDecision = evaluateRetry(attemptCount, now)
            if (retryDecision.retryAllowed && retryDecision.nextAttemptAt) {
              await this.queue.scheduleRetry(
                job.id,
                retryDecision.nextAttemptAt,
                execution.failureReason ?? 'Unknown failure'
              )
              result.retryScheduled++
            } else {
              await this.queue.markFailed(
                job.id,
                execution.failureReason ?? 'Retry exhausted'
              )
              result.failed++
            }
          } else {
            await this.queue.markFailed(
              job.id,
              execution.failureReason ?? 'Non-retryable failure'
            )
            result.failed++
          }
        }
      } catch (error) {
        const message = error instanceof Error ? error.message : 'Unknown error'
        await this.queue.markFailed(job.id, message)
        result.failed++
      }
    }

    return result
  }
}