// Runtime verification of the calendar platform layer.
// Run with: npx tsx src/platform/calendar/__tests__/calendar.verify.ts

import { InternalCalendarAdapter } from '../adapters/internal/internal-calendar.adapter'
import { CalendarService } from '../calendar.service'
import type { ICalendarAdapter, ICalendarEvent, ICalendarResult } from '../interfaces'

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

const testEvent: ICalendarEvent = {
  title: 'Haircut with Jane',
  description: 'Standard trim',
  startUtc: new Date('2026-08-01T09:00:00Z'),
  endUtc: new Date('2026-08-01T09:30:00Z'),
  timezone: 'Asia/Kolkata',
  organizerEmail: 'business@example.com',
  attendeeEmail: 'customer@example.com',
  attendeeName: 'John Smith',
}

class StubFailingAdapter implements ICalendarAdapter {
  readonly provider = 'FAILING'
  async createEvent(_e: ICalendarEvent): Promise<ICalendarResult> {
    throw new Error('External API unreachable')
  }
  async updateEvent(_id: string, _e: ICalendarEvent): Promise<ICalendarResult> {
    throw new Error('External API unreachable')
  }
  async deleteEvent(_id: string): Promise<ICalendarResult> {
    throw new Error('External API unreachable')
  }
  async isHealthy(): Promise<boolean> { return false }
}

async function main() {
  // ---------------------------------------------------------------------------
  // InternalCalendarAdapter Tests
  // ---------------------------------------------------------------------------

  console.log('--- InternalCalendarAdapter ---')

  const adapter = new InternalCalendarAdapter()

  assert(
    'adapter provider is INTERNAL',
    adapter.provider === 'INTERNAL',
    'INTERNAL',
    adapter.provider
  )

  assert(
    'adapter isHealthy returns true',
    await adapter.isHealthy() === true,
    true,
    await adapter.isHealthy()
  )

  const createResult = await adapter.createEvent(testEvent)
  assert(
    'createEvent returns success true',
    createResult.success === true,
    true,
    createResult.success
  )
  assert(
    'createEvent returns provider INTERNAL',
    createResult.provider === 'INTERNAL',
    'INTERNAL',
    createResult.provider
  )
  assert(
    'createEvent returns an externalEventId',
    typeof createResult.externalEventId === 'string' && createResult.externalEventId.length > 0,
    'string',
    typeof createResult.externalEventId
  )

  const updateResult = await adapter.updateEvent('event-123', testEvent)
  assert(
    'updateEvent returns success true',
    updateResult.success === true,
    true,
    updateResult.success
  )
  assert(
    'updateEvent returns same eventId',
    updateResult.externalEventId === 'event-123',
    'event-123',
    updateResult.externalEventId
  )

  const deleteResult = await adapter.deleteEvent('event-123')
  assert(
    'deleteEvent returns success true',
    deleteResult.success === true,
    true,
    deleteResult.success
  )
  assert(
    'deleteEvent returns same eventId',
    deleteResult.externalEventId === 'event-123',
    'event-123',
    deleteResult.externalEventId
  )

  // ---------------------------------------------------------------------------
  // CalendarService Tests
  // ---------------------------------------------------------------------------

  console.log('--- CalendarService ---')

  const service = new CalendarService(new InternalCalendarAdapter())

  assert(
    'activeProvider returns INTERNAL',
    service.activeProvider() === 'INTERNAL',
    'INTERNAL',
    service.activeProvider()
  )

  assert(
    'isAdapterHealthy returns true for internal adapter',
    await service.isAdapterHealthy() === true,
    true,
    await service.isAdapterHealthy()
  )

  const serviceCreate = await service.createEvent(testEvent)
  assert(
    'service createEvent returns success true',
    serviceCreate.success === true,
    true,
    serviceCreate.success
  )

  const serviceUpdate = await service.updateEvent('event-456', testEvent)
  assert(
    'service updateEvent returns success true',
    serviceUpdate.success === true,
    true,
    serviceUpdate.success
  )

  const serviceDelete = await service.deleteEvent('event-456')
  assert(
    'service deleteEvent returns success true',
    serviceDelete.success === true,
    true,
    serviceDelete.success
  )

  const failingService = new CalendarService(new StubFailingAdapter())

  const failCreate = await failingService.createEvent(testEvent)
  assert(
    'service catches adapter throw on createEvent',
    failCreate.success === false,
    false,
    failCreate.success
  )
  assert(
    'service returns failureReason from thrown error',
    failCreate.failureReason === 'External API unreachable',
    'External API unreachable',
    failCreate.failureReason
  )

  assert(
    'isAdapterHealthy returns false for failing adapter',
    await failingService.isAdapterHealthy() === false,
    false,
    await failingService.isAdapterHealthy()
  )

  // ---------------------------------------------------------------------------
  // Summary
  // ---------------------------------------------------------------------------

  console.log('')
  console.log('=========================================')
  console.log('Calendar Platform Tests: ' + passed + ' passed, ' + failed + ' failed')
  console.log('=========================================')

  if (failed > 0) process.exit(1)
}

main().catch((error) => {
  console.error('Test runner failed:', error)
  process.exit(1)
})
