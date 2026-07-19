// InMemoryQueue
// A deterministic, testable in-memory job queue.
// Jobs are stored in process memory and ordered by scheduledFor ascending.
// The persistent layer is owned by the handlers (e.g. ReminderHandler -> Reminder table).
// This queue owns execution ordering and claiming within a single worker run.

import type { IJobQueue } from '../contracts/JobQueue'
import type { Job, CreateJobInput } from '../contracts/Job'
import { randomUUID } from 'crypto'

export class InMemoryQueue implements IJobQueue {
  private jobs: Map<string, Job> = new Map()

  async enqueue(input: CreateJobInput): Promise<Job> {
    const now = new Date()
    const job: Job = {
      id: randomUUID(),
      type: input.type,
      status: 'PENDING',
      priority: input.priority ?? 'NORMAL',
      payload: input.payload,
      scheduledFor: input.scheduledFor ?? now,
      attemptCount: 0,
      maxAttempts: input.maxAttempts ?? 3,
      lastAttemptAt: null,
      nextAttemptAt: null,
      startedAt: null,
      completedAt: null,
      failedAt: null,
      failureReason: null,
      createdAt: now,
      updatedAt: now,
    }
    this.jobs.set(job.id, job)
    return job
  }

  async dequeue(limit: number, now: Date = new Date()): Promise<Job[]> {
    const due = Array.from(this.jobs.values())
      .filter(
        (j) =>
          (j.status === 'PENDING' && j.scheduledFor <= now) ||
          (j.status === 'RETRY_PENDING' &&
            j.nextAttemptAt != null &&
            j.nextAttemptAt <= now)
      )
      .sort((a, b) => {
        const priorityOrder: Record<string, number> = {
          HIGH: 0,
          NORMAL: 1,
          LOW: 2,
        }
        const pa = priorityOrder[a.priority] ?? 1
        const pb = priorityOrder[b.priority] ?? 1
        if (pa !== pb) return pa - pb
        return a.scheduledFor.getTime() - b.scheduledFor.getTime()
      })
      .slice(0, limit)
    return due
  }

  async claim(jobId: string): Promise<boolean> {
    const job = this.jobs.get(jobId)
    if (!job) return false
    if (job.status !== 'PENDING' && job.status !== 'RETRY_PENDING') return false
    const now = new Date()
    this.jobs.set(jobId, {
      ...job,
      status: 'RUNNING',
      lastAttemptAt: now,
      attemptCount: job.attemptCount + 1,
      startedAt: job.startedAt ?? now,
      updatedAt: now,
    })
    return true
  }

  async markCompleted(jobId: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return
    const now = new Date()
    this.jobs.set(jobId, {
      ...job,
      status: 'COMPLETED',
      completedAt: now,
      failureReason: null,
      nextAttemptAt: null,
      updatedAt: now,
    })
  }

  async markFailed(jobId: string, reason: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return
    const now = new Date()
    this.jobs.set(jobId, {
      ...job,
      status: 'FAILED',
      failedAt: now,
      failureReason: reason.slice(0, 500),
      nextAttemptAt: null,
      updatedAt: now,
    })
  }

  async scheduleRetry(jobId: string, nextAttemptAt: Date, reason: string): Promise<void> {
    const job = this.jobs.get(jobId)
    if (!job) return
    this.jobs.set(jobId, {
      ...job,
      status: 'RETRY_PENDING',
      nextAttemptAt,
      failureReason: reason.slice(0, 500),
      updatedAt: new Date(),
    })
  }

  async size(): Promise<number> {
    return this.jobs.size
  }

  snapshot(): Job[] {
    return Array.from(this.jobs.values())
  }

  clear(): void {
    this.jobs.clear()
  }
}