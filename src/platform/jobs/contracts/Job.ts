// Job
// The central execution model for all background work.
// Every asynchronous capability in the platform becomes a Job.
// No feature creates its own processor. It creates a Job.

export type JobStatus =
  | 'PENDING'
  | 'CLAIMED'
  | 'RUNNING'
  | 'COMPLETED'
  | 'FAILED'
  | 'RETRY_PENDING'
  | 'CANCELLED'

export type JobType =
  | 'REMINDER'
  | 'CALENDAR_SYNC'
  | 'CLEANUP'
  | 'ANALYTICS_REFRESH'

export type JobPriority = 'LOW' | 'NORMAL' | 'HIGH'

export interface Job {
  id: string
  type: JobType
  status: JobStatus
  priority: JobPriority
  payload: Record<string, unknown>
  scheduledFor: Date
  attemptCount: number
  maxAttempts: number
  lastAttemptAt?: Date | null
  nextAttemptAt?: Date | null
  startedAt?: Date | null
  completedAt?: Date | null
  failedAt?: Date | null
  failureReason?: string | null
  createdAt: Date
  updatedAt: Date
}

export interface CreateJobInput {
  type: JobType
  payload: Record<string, unknown>
  scheduledFor?: Date
  priority?: JobPriority
  maxAttempts?: number
}
