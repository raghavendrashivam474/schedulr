// IJobDispatcher
// The dispatcher maps job types to handlers.
// Adding a new job type requires registering one handler.
// The worker and dispatcher never change.

import type { IJobHandler } from './JobHandler'
import type { Job } from './Job'
import type { JobExecutionResult } from './JobHandler'

export interface IJobDispatcher {
  register(handler: IJobHandler): void
  dispatch(job: Job): Promise<JobExecutionResult>
  has(jobType: string): boolean
}
