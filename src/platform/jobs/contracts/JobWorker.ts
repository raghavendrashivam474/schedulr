// IJobWorker
// The worker polls, claims, and executes jobs.
// It contains zero business logic.
// Business logic belongs exclusively in handlers.

export interface WorkerRunResult {
  found: number
  claimed: number
  completed: number
  failed: number
  retryScheduled: number
  skipped: number
}

export interface IJobWorker {
  run(now?: Date): Promise<WorkerRunResult>
}
