// ProviderRegistry
// Holds all registered notification providers.
// The NotificationService asks the registry for the correct provider.
// Adding a new provider never requires changes to any business logic.

import type { INotificationProvider } from '../interfaces'

export class ProviderRegistry {
  private readonly providers = new Map<string, INotificationProvider>()

  register(provider: INotificationProvider): void {
    this.providers.set(provider.channel, provider)
  }

  resolve(channel: string): INotificationProvider {
    const provider = this.providers.get(channel)
    if (!provider) {
      throw new Error(
        `[ProviderRegistry] No provider registered for channel: ${channel}`
      )
    }
    return provider
  }

  has(channel: string): boolean {
    return this.providers.has(channel)
  }

  registeredChannels(): string[] {
    return Array.from(this.providers.keys())
  }
}
