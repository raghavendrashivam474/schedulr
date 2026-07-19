// notification-dispatcher.ts
// Dispatches reminders through the NotificationService abstraction.
// This file no longer knows how notifications are delivered.
// It only knows that a notification must be sent.

import { prisma } from '@lib/prisma'
import { reminderEmailTemplate } from '@features/notifications/templates/reminder.templates'
import { NotificationService } from '@platform/notification/notification.service'
import { ProviderRegistry } from '@platform/notification/registry/provider-registry'
import { EmailProvider } from '@platform/notification/providers/email/email.provider'
import type { DispatchResult } from '../types'

function intervalLabel(intervalKey: string): string {
  if (intervalKey === 'REMINDER_24H') return 'tomorrow'
  if (intervalKey === 'REMINDER_2H') return 'in 2 hours'
  if (intervalKey === 'REMINDER_30M') return 'in 30 minutes'
  return 'soon'
}

function buildNotificationService(): NotificationService {
  const registry = new ProviderRegistry()
  registry.register(new EmailProvider())
  return new NotificationService(registry)
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

  const service = buildNotificationService()

  const result = await service.send({
    channel: reminder.channel as 'EMAIL',
    recipient: booking.customerEmail,
    subject: template.subject,
    body: template.html,
    metadata: { text: template.text },
  })

  if (!result.success) {
    return {
      success: false,
      failureReason: result.failureReason ?? 'Notification service did not confirm delivery',
    }
  }

  return { success: true }
}
