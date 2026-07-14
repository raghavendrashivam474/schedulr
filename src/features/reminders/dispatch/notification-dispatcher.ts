import { prisma } from '@lib/prisma'
import { sendEmail } from '@features/notifications/services/email.service'
import { reminderEmailTemplate } from '@features/notifications/templates/reminder.templates'
import type { DispatchResult } from '../types'

function intervalLabel(intervalKey: string): string {
  if (intervalKey === 'REMINDER_24H') return 'tomorrow'
  if (intervalKey === 'REMINDER_2H') return 'in 2 hours'
  if (intervalKey === 'REMINDER_30M') return 'in 30 minutes'
  return 'soon'
}

export async function dispatchReminder(reminderId: string): Promise<DispatchResult> {
  const reminder = await prisma.reminder.findUnique({
    where: { id: reminderId },
    include: {
      booking: {
        include: { service: true, business: true },
      },
    },
  })

  if (!reminder) {
    return { success: false, failureReason: 'Reminder not found' }
  }

  const { booking } = reminder
  if (booking.status !== 'CONFIRMED' && booking.status !== 'CHECKED_IN') {
    return { success: false, failureReason: 'Booking is no longer active' }
  }

  if (reminder.channel !== 'EMAIL') {
    return { success: false, failureReason: 'Unsupported channel: ' + reminder.channel }
  }

  const dateFormatted = new Date(booking.appointmentDate).toLocaleDateString('en-GB', {
    weekday: 'long', year: 'numeric', month: 'long', day: 'numeric',
  })

  const template = reminderEmailTemplate({
    customerName: booking.customerName,
    businessName: booking.business.name,
    serviceName: booking.service.name,
    appointmentDate: dateFormatted,
    startTime: booking.startTime,
    timeUntil: intervalLabel(reminder.intervalKey),
    businessEmail: booking.business.contactEmail,
    businessPhone: booking.business.contactPhone,
  })

  const sent = await sendEmail({
    to: booking.customerEmail,
    subject: template.subject,
    html: template.html,
    text: template.text,
  })

  if (!sent) {
    return { success: false, failureReason: 'Email provider did not confirm delivery' }
  }

  return { success: true }
}
