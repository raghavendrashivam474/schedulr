// INotification
// Represents a notification request that the platform wants to deliver.
// The platform does not know how it will be delivered.
// That decision belongs to the provider.

export interface INotification {
  channel: NotificationChannel
  recipient: string
  subject: string
  body: string
  metadata?: Record<string, string>
}

export type NotificationChannel = 'EMAIL' | 'SMS' | 'WHATSAPP' | 'PUSH'
