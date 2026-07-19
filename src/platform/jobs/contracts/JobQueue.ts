// IJobQueue
// The queue owns execution order and job persistence.
// The worker asks the queue for work.
// The worker never queries the database directly.

import type { Job, CreateJobInput } from './Job'

export interface IJobQueue {
  enqueue(input: CreateJobInput): Promise<Job>
  dequeue(limit: number): Promise<Job[]>
  claim(jobId: string): Promise<boolean>
  markCompleted(jobId: string): Promise<void>
  markFailed(jobId: string, reason: string): Promise<void>
  scheduleRetry(jobId: string, nextAttemptAt: Date, reason: string): Promise<void>
  size(): Promise<number>
}
