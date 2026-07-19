// INotificationProvider
// Every delivery provider must implement this interface.
// The NotificationService only knows this contract.
// It never knows whether it is talking to nodemailer, Twilio, or anything else.

import type { INotification } from './notification.interface'
import type { INotificationResult } from './result.interface'

export interface INotificationProvider {
  readonly channel: string
  send(notification: INotification): Promise<INotificationResult>
  isHealthy(): Promise<boolean>
}
