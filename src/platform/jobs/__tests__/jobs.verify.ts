// Runtime verification of the background job platform.
// Run with: npx tsx src/platform/jobs/__tests__/jobs.verify.ts

import { InMemoryQueue } from '../queue/InMemoryQueue'
import { JobDispatcher } from '../scheduler/JobDispatcher'
import { JobWorker } from '../scheduler/JobWorker'
import type { IJobHandler, JobExecutionResult } from '../contracts/JobHandler'
import type { Job } from '../contracts/Job'

let passed = 0
let failed = 0

function assert(name: string, condition: boolean, expected?: unknown, actual?: unknown) {
  if (condition) {
    console.log('PASS:', name)
    passed++
  } else {
    console.log('FAIL:', name, '| expected:', expected, '| actual:', actual)
    failed++
  }
}

class StubSuccessHandler implements IJobHandler {
  readonly jobType = 'REMINDER'
  async execute(_job: Job): Promise<JobExecutionResult> {
    return { success: true }
  }
}

class StubFailRetryableHandler implements IJobHandler {
  readonly jobType = 'CALENDAR_SYNC'
  async execute(_job: Job): Promise<JobExecutionResult> {
    return { success: false, failureReason: 'External API down', retryable: true }
  }
}

class StubFailNonRetryableHandler implements IJobHandler {
  readonly jobType = 'CLEANUP'
  async execute(_job: Job): Promise<JobExecutionResult> {
    return { success: false, failureReason: 'Invalid payload', retryable: false }
  }
}

class StubThrowingHandler implements IJobHandler {
  readonly jobType = 'ANALYTICS_REFRESH'
  async execute(_job: Job): Promise<JobExecutionResult> {
    throw new Error('Handler crashed unexpectedly')
  }
}

async function main() {
  // ---------------------------------------------------------------------------
  // InMemoryQueue Tests
  // ---------------------------------------------------------------------------

  console.log('--- InMemoryQueue ---')

  const queue = new InMemoryQueue()

  assert('queue starts empty', await queue.size() === 0, 0, await queue.size())

  const now = new Date('2026-08-01T10:00:00Z')
  const past = new Date('2026-08-01T09:00:00Z')
  const future = new Date('2026-08-01T11:00:00Z')

  const job1 = await queue.enqueue({
    type: 'REMINDER',
    payload: { reminderId: 'rem-1' },
    scheduledFor: past,
    priority: 'NORMAL',
    maxAttempts: 3,
  })

  const job2 = await queue.enqueue({
    type: 'CALENDAR_SYNC',
    payload: { operation: 'CREATE' },
    scheduledFor: past,
    priority: 'HIGH',
    maxAttempts: 3,
  })

  const job3 = await queue.enqueue({
    type: 'CLEANUP',
    payload: { target: 'sessions' },
    scheduledFor: future,
    priority: 'LOW',
    maxAttempts: 3,
  })

  assert('queue size is 3 after enqueue', await queue.size() === 3, 3, await queue.size())

  const due = await queue.dequeue(10, now)
  assert('dequeue returns 2 due jobs', due.length === 2, 2, due.length)
  assert('HIGH priority job is first', due[0].type === 'CALENDAR_SYNC', 'CALENDAR_SYNC', due[0].type)
  assert(
    'future job not included in dequeue',
    due.every((j) => j.id !== job3.id),
    true,
    due.every((j) => j.id !== job3.id)
  )

  const claimed = await queue.claim(job1.id)
  assert('claim PENDING job returns true', claimed, true, claimed)

  const claimedAgain = await queue.claim(job1.id)
  assert('claim RUNNING job returns false', !claimedAgain, false, claimedAgain)

  await queue.markCompleted(job1.id)
  const snap1 = queue.snapshot().find((j) => j.id === job1.id)
  assert('markCompleted sets status COMPLETED', snap1?.status === 'COMPLETED', 'COMPLETED', snap1?.status)
  assert('markCompleted sets completedAt', snap1?.completedAt instanceof Date, true, snap1?.completedAt instanceof Date)

  await queue.claim(job2.id)
  await queue.markFailed(job2.id, 'Something went wrong')
  const snap2 = queue.snapshot().find((j) => j.id === job2.id)
  assert('markFailed sets status FAILED', snap2?.status === 'FAILED', 'FAILED', snap2?.status)
  assert('markFailed sets failureReason', snap2?.failureReason === 'Something went wrong', 'Something went wrong', snap2?.failureReason)

  const retryJob = await queue.enqueue({
    type: 'REMINDER',
    payload: { reminderId: 'rem-retry' },
    scheduledFor: past,
    priority: 'NORMAL',
    maxAttempts: 3,
  })
  await queue.claim(retryJob.id)
  const retryAt = new Date(now.getTime() + 5 * 60 * 1000)
  await queue.scheduleRetry(retryJob.id, retryAt, 'Temporary failure')
  const snapRetry = queue.snapshot().find((j) => j.id === retryJob.id)
  assert('scheduleRetry sets status RETRY_PENDING', snapRetry?.status === 'RETRY_PENDING', 'RETRY_PENDING', snapRetry?.status)
  assert('scheduleRetry sets nextAttemptAt', snapRetry?.nextAttemptAt?.getTime() === retryAt.getTime(), retryAt.getTime(), snapRetry?.nextAttemptAt?.getTime())

  const afterRetry = new Date(retryAt.getTime() + 1000)
  const dueLater = await queue.dequeue(10, afterRetry)
  assert(
    'RETRY_PENDING job appears in dequeue after nextAttemptAt',
    dueLater.some((j) => j.id === retryJob.id),
    true,
    dueLater.some((j) => j.id === retryJob.id)
  )

  queue.clear()
  assert('clear empties the queue', await queue.size() === 0, 0, await queue.size())

  // ---------------------------------------------------------------------------
  // JobDispatcher Tests
  // ---------------------------------------------------------------------------

  console.log('--- JobDispatcher ---')

  const dispatcher = new JobDispatcher()
  dispatcher.register(new StubSuccessHandler())
  dispatcher.register(new StubFailRetryableHandler())
  dispatcher.register(new StubFailNonRetryableHandler())
  dispatcher.register(new StubThrowingHandler())

  assert('dispatcher has REMINDER', dispatcher.has('REMINDER'), true, dispatcher.has('REMINDER'))
  assert('dispatcher has CALENDAR_SYNC', dispatcher.has('CALENDAR_SYNC'), true, dispatcher.has('CALENDAR_SYNC'))
  assert('dispatcher does not have UNKNOWN', !dispatcher.has('UNKNOWN'), false, dispatcher.has('UNKNOWN'))
  assert('registeredTypes returns 4', dispatcher.registeredTypes().length === 4, 4, dispatcher.registeredTypes().length)

  const fakeJob = (type: string): Job => ({
    id: 'test-id',
    type: type as Job['type'],
    status: 'RUNNING',
    priority: 'NORMAL',
    payload: {},
    scheduledFor: now,
    attemptCount: 1,
    maxAttempts: 3,
    lastAttemptAt: null,
    nextAttemptAt: null,
    startedAt: null,
    completedAt: null,
    failedAt: null,
    failureReason: null,
    createdAt: now,
    updatedAt: now,
  })

  const successResult = await dispatcher.dispatch(fakeJob('REMINDER'))
  assert('dispatch REMINDER returns success', successResult.success, true, successResult.success)

  const failResult = await dispatcher.dispatch(fakeJob('CALENDAR_SYNC'))
  assert('dispatch CALENDAR_SYNC returns failure', !failResult.success, false, failResult.success)
  assert('dispatch CALENDAR_SYNC is retryable', failResult.retryable, true, failResult.retryable)

  const throwResult = await dispatcher.dispatch(fakeJob('ANALYTICS_REFRESH'))
  assert('dispatch catches thrown error', !throwResult.success, false, throwResult.success)
  assert('dispatch thrown error is retryable', throwResult.retryable, true, throwResult.retryable)

  const cleanupResult = await dispatcher.dispatch(fakeJob('CLEANUP'))
  assert('dispatch CLEANUP returns failure from non-retryable handler', !cleanupResult.success, false, cleanupResult.success)
  assert('dispatch CLEANUP is not retryable', cleanupResult.retryable === false, false, cleanupResult.retryable)

  const noHandlerDispatcher = new JobDispatcher()
  const noHandlerResult = await noHandlerDispatcher.dispatch(fakeJob('REMINDER'))
  assert('dispatch with no handler returns failure', !noHandlerResult.success, false, noHandlerResult.success)
  assert('dispatch with no handler is not retryable', noHandlerResult.retryable === false, false, noHandlerResult.retryable)

  // ---------------------------------------------------------------------------
  // JobWorker Tests
  // ---------------------------------------------------------------------------

  console.log('--- JobWorker ---')

  const workerQueue = new InMemoryQueue()
  const workerDispatcher = new JobDispatcher()
  workerDispatcher.register(new StubSuccessHandler())
  workerDispatcher.register(new StubFailRetryableHandler())
  workerDispatcher.register(new StubFailNonRetryableHandler())

  const worker = new JobWorker(workerQueue, workerDispatcher)

  // REMINDER  -> success        -> completed
  await workerQueue.enqueue({
    type: 'REMINDER',
    payload: { reminderId: 'rem-worker-1' },
    scheduledFor: past,
    priority: 'NORMAL',
    maxAttempts: 3,
  })

  // CALENDAR_SYNC -> retryable failure, maxAttempts=3, attemptCount will be 1 after claim
  // evaluateRetry(1) -> retryAllowed=true -> retryScheduled
  await workerQueue.enqueue({
    type: 'CALENDAR_SYNC',
    payload: { operation: 'CREATE' },
    scheduledFor: past,
    priority: 'NORMAL',
    maxAttempts: 3,
  })

  // CLEANUP -> non-retryable failure -> failed
  await workerQueue.enqueue({
    type: 'CLEANUP',
    payload: { target: 'sessions' },
    scheduledFor: past,
    priority: 'NORMAL',
    maxAttempts: 3,
  })

  const workerResult = await worker.run(now)

  assert('worker found 3 jobs', workerResult.found === 3, 3, workerResult.found)
  assert('worker claimed 3 jobs', workerResult.claimed === 3, 3, workerResult.claimed)
  assert('worker completed 1 job', workerResult.completed === 1, 1, workerResult.completed)
  assert('worker scheduled 1 retry', workerResult.retryScheduled === 1, 1, workerResult.retryScheduled)
  assert('worker failed 1 job', workerResult.failed === 1, 1, workerResult.failed)
  assert('worker skipped 0 jobs', workerResult.skipped === 0, 0, workerResult.skipped)

  const emptyResult = await worker.run(now)
  assert('worker run on empty queue finds 0', emptyResult.found === 0, 0, emptyResult.found)

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  console.log('')
  console.log('=========================================')
  console.log('Background Job Platform Tests: ' + passed + ' passed, ' + failed + ' failed')
  console.log('=========================================')

  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})