// IJobHandler
// Every handler owns exactly one job type.
// The worker never knows what the handler does.
// The handler never knows it is inside a worker.

import type { Job } from './Job'

export interface JobExecutionResult {
  success: boolean
  failureReason?: string
  retryable?: boolean
}

export interface IJobHandler {
  readonly jobType: string
  execute(job: Job): Promise<JobExecutionResult>
}
