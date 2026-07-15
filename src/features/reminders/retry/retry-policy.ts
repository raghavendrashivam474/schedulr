// Retry policy is deterministic and independently testable.
// attemptCount represents total delivery attempts:
//   Attempt 1 failed -> allow retry after 5 minutes
//   Attempt 2 failed -> allow retry after 15 minutes
//   Attempt 3 failed -> exhausted, becomes FAILED terminal

export const MAX_ATTEMPTS = 3

export interface RetryDecision {
  retryAllowed: boolean
  delayMs?: number
  nextAttemptAt?: Date
  reason?: 'EXHAUSTED' | 'INVALID_INPUT'
}

function isValidAttemptCount(value: unknown): value is number {
  if (typeof value !== 'number') return false
  if (!Number.isFinite(value)) return false
  if (!Number.isInteger(value)) return false
  if (value < 1) return false
  return true
}

export function evaluateRetry(attemptCount: number, now: Date = new Date()): RetryDecision {
  if (!isValidAttemptCount(attemptCount)) {
    return { retryAllowed: false, reason: 'INVALID_INPUT' }
  }

  if (attemptCount >= MAX_ATTEMPTS) {
    return { retryAllowed: false, reason: 'EXHAUSTED' }
  }

  let delayMs: number
  if (attemptCount === 1) {
    delayMs = 5 * 60 * 1000
  } else if (attemptCount === 2) {
    delayMs = 15 * 60 * 1000
  } else {
    return { retryAllowed: false, reason: 'EXHAUSTED' }
  }

  const nextAttemptAt = new Date(now.getTime() + delayMs)
  return { retryAllowed: true, delayMs, nextAttemptAt }
}
