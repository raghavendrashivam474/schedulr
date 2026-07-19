// NotificationService
// The single entry point for all notification delivery.
// Business logic calls this. It never calls a provider directly.
// The service asks the registry for the correct provider and delegates.

import type { INotification, INotificationResult } from './interfaces'
import type { ProviderRegistry } from './registry'

export class NotificationService {
  constructor(private readonly registry: ProviderRegistry) {}

  async send(notification: INotification): Promise<INotificationResult> {
    if (!this.registry.has(notification.channel)) {
      return {
        success: false,
        provider: 'NotificationService',
        channel: notification.channel,
        failureReason: `No provider registered for channel: ${notification.channel}`,
        retryable: false,
      }
    }

    const provider = this.registry.resolve(notification.channel)

    try {
      return await provider.send(notification)
    } catch (error) {
      const message = error instanceof Error ? error.message : 'Unknown error'
      return {
        success: false,
        provider: provider.channel,
        channel: notification.channel,
        failureReason: message,
        retryable: true,
      }
    }
  }

  async isProviderHealthy(channel: string): Promise<boolean> {
    if (!this.registry.has(channel)) return false
    const provider = this.registry.resolve(channel)
    return provider.isHealthy()
  }

  registeredChannels(): string[] {
    return this.registry.registeredChannels()
  }
}
