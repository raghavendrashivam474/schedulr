// Runtime verification of the time foundation.
// Run with: npx tsx src/lib/time/__tests__/time.verify.ts

import {
  isValidTimezone,
  normalizeTimezone,
  businessTimeToUTC,
  utcToBusinessTime,
  formatInBusinessTime,
  combineBusinessDateTimeToUTC,
  isSameBusinessDay,
  todayInBusinessTimezone,
} from '../index'

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

console.log('--- Timezone Validation ---')
assert('valid IANA timezone accepted', isValidTimezone('Asia/Kolkata'))
assert('UTC accepted', isValidTimezone('UTC'))
assert('invalid timezone rejected', !isValidTimezone('NotAZone'))
assert('empty string rejected', !isValidTimezone(''))
assert('normalize invalid returns UTC', normalizeTimezone('Bad/Zone') === 'UTC')
assert('normalize null returns UTC', normalizeTimezone(null) === 'UTC')

console.log('--- UTC Conversion ---')
// 10:00 Asia/Kolkata should be 04:30 UTC
const kolkataMorning = combineBusinessDateTimeToUTC('2026-08-01', '10:00', 'Asia/Kolkata')
const kolkataUTCHour = kolkataMorning.getUTCHours()
const kolkataUTCMinutes = kolkataMorning.getUTCMinutes()
assert('Kolkata 10:00 = UTC 04:30 (hours)', kolkataUTCHour === 4, 4, kolkataUTCHour)
assert('Kolkata 10:00 = UTC 04:30 (minutes)', kolkataUTCMinutes === 30, 30, kolkataUTCMinutes)

// 09:00 America/New_York in August = 13:00 UTC (EDT is UTC-4)
const nyMorning = combineBusinessDateTimeToUTC('2026-08-01', '09:00', 'America/New_York')
assert('New York 09:00 EDT = UTC 13:00', nyMorning.getUTCHours() === 13, 13, nyMorning.getUTCHours())

console.log('--- Round Trip ---')
const backToKolkata = formatInBusinessTime(kolkataMorning, 'Asia/Kolkata', 'yyyy-MM-dd HH:mm')
assert('Kolkata round trip preserves wall-clock', backToKolkata === '2026-08-01 10:00', '2026-08-01 10:00', backToKolkata)

console.log('--- Same Business Day ---')
const a = combineBusinessDateTimeToUTC('2026-08-01', '08:00', 'Asia/Kolkata')
const b = combineBusinessDateTimeToUTC('2026-08-01', '22:00', 'Asia/Kolkata')
assert('Same business day - Kolkata 08:00 and 22:00', isSameBusinessDay(a, b, 'Asia/Kolkata'))

// Cross-day case: 23:00 Kolkata and 02:00 next day Kolkata
const nextDay = combineBusinessDateTimeToUTC('2026-08-02', '02:00', 'Asia/Kolkata')
assert('Different business days - Kolkata 22:00 and next 02:00', !isSameBusinessDay(b, nextDay, 'Asia/Kolkata'))

console.log('--- Today in Business TZ ---')
const today = todayInBusinessTimezone('Asia/Kolkata')
assert('Today matches YYYY-MM-DD format', /^\d{4}-\d{2}-\d{2}$/.test(today), 'YYYY-MM-DD', today)

console.log('--- Simple UTC ToBusinessTime ---')
const utcNoon = new Date('2026-08-01T12:00:00Z')
const kolkataDisplay = formatInBusinessTime(utcNoon, 'Asia/Kolkata', 'HH:mm')
// 12:00 UTC = 17:30 Kolkata (UTC+5:30)
assert('UTC 12:00 displayed as Kolkata 17:30', kolkataDisplay === '17:30', '17:30', kolkataDisplay)

// convert business time functionality
const kolkataMorningDate = utcToBusinessTime(kolkataMorning, 'Asia/Kolkata')
assert('utcToBusinessTime returns Date object', kolkataMorningDate instanceof Date)

console.log('')
console.log('=========================================')
console.log('Time Foundation Tests: ' + passed + ' passed, ' + failed + ' failed')
console.log('=========================================')

if (failed > 0) process.exit(1)
