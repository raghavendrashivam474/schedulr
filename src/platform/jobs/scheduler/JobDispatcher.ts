// JobDispatcher
// Maps job types to handlers.
// The worker calls dispatch(job) and never knows what executes.
// Adding a new job type requires registering one handler here.
// The dispatcher itself never changes.

import type { IJobDispatcher } from '../contracts/JobDispatcher'
import type { IJobHandler, JobExecutionResult } from '../contracts/JobHandler'
import type { Job } from '../contracts/Job'

export class JobDispatcher implements IJobDispatcher {
  private readonly handlers = new Map<string, IJobHandler>()

  register(handler: IJobHandler): void {
    this.handlers.set(handler.jobType, handler)
  }

  has(jobType: string): boolean {
    return this.handlers.has(jobType)
  }

  async dispatch(job: Job): Promise<JobExecutionResult> {
    const handler = this.handlers.get(job.type)

    if (!handler) {
      return {
        success: false,
        failureReason: `No handler registered for job type: ${job.type}`,
        retryable: false,
      }
    }

    try {
      return await handler.execute(job)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        failureReason: message,
        retryable: true,
      }
    }
  }

  registeredTypes(): string[] {
    return Array.from(this.handlers.keys())
  }
}
