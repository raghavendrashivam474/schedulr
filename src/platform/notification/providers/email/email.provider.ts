// EmailProvider
// Wraps the existing email.service.ts behind the INotificationProvider interface.
// The rest of the platform never imports email.service.ts directly again.
// All email-specific logic stays inside this file.

import type { INotificationProvider } from '../../interfaces'
import type { INotification, INotificationResult } from '../../interfaces'
import { sendEmail } from '@features/notifications/services/email.service'

export class EmailProvider implements INotificationProvider {
  readonly channel = 'EMAIL'

  async send(notification: INotification): Promise<INotificationResult> {
    if (notification.channel !== 'EMAIL') {
      return {
        success: false,
        provider: 'EmailProvider',
        channel: notification.channel,
        failureReason: `EmailProvider cannot handle channel: ${notification.channel}`,
        retryable: false,
      }
    }

    const sent = await sendEmail({
      to: notification.recipient,
      subject: notification.subject,
      html: notification.body,
      text: notification.metadata?.['text'] ?? notification.body,
    })

    if (!sent) {
      return {
        success: false,
        provider: 'EmailProvider',
        channel: 'EMAIL',
        failureReason: 'Email provider did not confirm delivery',
        retryable: true,
      }
    }

    return {
      success: true,
      provider: 'EmailProvider',
      channel: 'EMAIL',
    }
  }

  async isHealthy(): Promise<boolean> {
    const host = process.env.EMAIL_SERVER_HOST
    const user = process.env.EMAIL_SERVER_USER
    const pass = process.env.EMAIL_SERVER_PASSWORD
    return Boolean(host && user && pass)
  }
}
