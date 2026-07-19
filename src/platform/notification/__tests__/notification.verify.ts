// Runtime verification of the notification platform layer.
// Run with: npx tsx src/platform/notification/__tests__/notification.verify.ts

import { ProviderRegistry } from '../registry/provider-registry'
import { NotificationService } from '../notification.service'
import type { INotificationProvider } from '../interfaces'
import type { INotification, INotificationResult } from '../interfaces'

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

class StubEmailProvider implements INotificationProvider {
  readonly channel = 'EMAIL'
  async send(_n: INotification): Promise<INotificationResult> {
    return { success: true, provider: 'StubEmail', channel: 'EMAIL' }
  }
  async isHealthy(): Promise<boolean> { return true }
}

class StubFailingProvider implements INotificationProvider {
  readonly channel = 'SMS'
  async send(_n: INotification): Promise<INotificationResult> {
    return {
      success: false,
      provider: 'StubSMS',
      channel: 'SMS',
      failureReason: 'SMS not configured',
      retryable: true,
    }
  }
  async isHealthy(): Promise<boolean> { return false }
}

class StubThrowingProvider implements INotificationProvider {
  readonly channel = 'PUSH'
  async send(_n: INotification): Promise<INotificationResult> {
    throw new Error('Provider crashed unexpectedly')
  }
  async isHealthy(): Promise<boolean> { return false }
}

async function main() {
  // ---------------------------------------------------------------------------
  // ProviderRegistry Tests
  // ---------------------------------------------------------------------------

  console.log('--- ProviderRegistry ---')

  const registry = new ProviderRegistry()
  registry.register(new StubEmailProvider())
  registry.register(new StubFailingProvider())

  assert(
    'registry has EMAIL after registration',
    registry.has('EMAIL'),
    true,
    registry.has('EMAIL')
  )

  assert(
    'registry has SMS after registration',
    registry.has('SMS'),
    true,
    registry.has('SMS')
  )

  assert(
    'registry does not have WHATSAPP',
    !registry.has('WHATSAPP'),
    false,
    registry.has('WHATSAPP')
  )

  const channels = registry.registeredChannels()
  assert(
    'registeredChannels returns two entries',
    channels.length === 2,
    2,
    channels.length
  )

  assert(
    'resolve EMAIL returns correct provider',
    registry.resolve('EMAIL').channel === 'EMAIL',
    'EMAIL',
    registry.resolve('EMAIL').channel
  )

  let threwOnMissing = false
  try {
    registry.resolve('WHATSAPP')
  } catch {
    threwOnMissing = true
  }
  assert(
    'resolve unregistered channel throws',
    threwOnMissing,
    true,
    threwOnMissing
  )

  // ---------------------------------------------------------------------------
  // NotificationService Tests
  // ---------------------------------------------------------------------------

  console.log('--- NotificationService ---')

  const serviceRegistry = new ProviderRegistry()
  serviceRegistry.register(new StubEmailProvider())
  serviceRegistry.register(new StubFailingProvider())
  serviceRegistry.register(new StubThrowingProvider())

  const service = new NotificationService(serviceRegistry)

  const emailNotification: INotification = {
    channel: 'EMAIL',
    recipient: 'test@example.com',
    subject: 'Test Subject',
    body: '<p>Test Body</p>',
  }

  const emailResult = await service.send(emailNotification)
  assert(
    'send EMAIL returns success true',
    emailResult.success === true,
    true,
    emailResult.success
  )
  assert(
    'send EMAIL result has correct provider',
    emailResult.provider === 'StubEmail',
    'StubEmail',
    emailResult.provider
  )

  const smsNotification: INotification = {
    channel: 'SMS',
    recipient: '+441234567890',
    subject: 'Reminder',
    body: 'Your appointment is tomorrow',
  }

  const smsResult = await service.send(smsNotification)
  assert(
    'send SMS returns success false from failing provider',
    smsResult.success === false,
    false,
    smsResult.success
  )
  assert(
    'send SMS result is retryable',
    smsResult.retryable === true,
    true,
    smsResult.retryable
  )

  const pushNotification: INotification = {
    channel: 'PUSH',
    recipient: 'device-token-abc',
    subject: 'Reminder',
    body: 'Your appointment is soon',
  }

  const pushResult = await service.send(pushNotification)
  assert(
    'send PUSH catches thrown error and returns failure',
    pushResult.success === false,
    false,
    pushResult.success
  )
  assert(
    'send PUSH failure reason contains error message',
    pushResult.failureReason === 'Provider crashed unexpectedly',
    'Provider crashed unexpectedly',
    pushResult.failureReason
  )

  const unregisteredNotification: INotification = {
    channel: 'WHATSAPP' as 'EMAIL',
    recipient: '+441234567890',
    subject: 'Reminder',
    body: 'Your appointment is soon',
  }

  const unregisteredResult = await service.send(unregisteredNotification)
  assert(
    'send unregistered channel returns failure without throwing',
    unregisteredResult.success === false,
    false,
    unregisteredResult.success
  )

  assert(
    'isProviderHealthy EMAIL returns true',
    await service.isProviderHealthy('EMAIL') === true,
    true,
    await service.isProviderHealthy('EMAIL')
  )

  assert(
    'isProviderHealthy SMS returns false',
    await service.isProviderHealthy('SMS') === false,
    false,
    await service.isProviderHealthy('SMS')
  )

  assert(
    'isProviderHealthy unregistered returns false',
    await service.isProviderHealthy('WHATSAPP') === false,
    false,
    await service.isProviderHealthy('WHATSAPP')
  )

  assert(
    'registeredChannels returns correct count',
    service.registeredChannels().length === 3,
    3,
    service.registeredChannels().length
  )

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  console.log('')
  console.log('=========================================')
  console.log('Notification Platform Tests: ' + passed + ' passed, ' + failed + ' failed')
  console.log('=========================================')

  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
