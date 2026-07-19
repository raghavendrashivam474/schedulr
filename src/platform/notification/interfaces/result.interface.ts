// INotificationResult
// Every provider returns this after an attempted delivery.
// The NotificationService uses this to decide retry behaviour.

export interface INotificationResult {
  success: boolean
  provider: string
  channel: string
  failureReason?: string
  retryable?: boolean
}
