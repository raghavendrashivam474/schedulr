export function reminderEmailTemplate(data: {
  customerName: string
  businessName: string
  serviceName: string
  appointmentDate: string
  startTime: string
  timeUntil: string
  businessEmail: string
  businessPhone?: string | null
}): { subject: string; html: string; text: string } {
  const subject = 'Reminder: Your appointment ' + data.timeUntil + ' at ' + data.businessName

  const html = '<!DOCTYPE html>' +
    '<html><head><meta charset="utf-8"></head>' +
    '<body style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;">' +
    '<div style="background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;">' +
    '<h1 style="color: white; margin: 0; font-size: 22px;">Appointment Reminder</h1>' +
    '</div>' +
    '<div style="border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;">' +
    '<p>Hi ' + data.customerName + ',</p>' +
    '<p>This is a friendly reminder about your upcoming appointment ' + data.timeUntil + '.</p>' +
    '<div style="background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;">' +
    '<table style="width: 100%; border-collapse: collapse;">' +
    '<tr><td style="padding: 6px 0; color: #6b7280;">Business</td><td style="padding: 6px 0; font-weight: 600;">' + data.businessName + '</td></tr>' +
    '<tr><td style="padding: 6px 0; color: #6b7280;">Service</td><td style="padding: 6px 0; font-weight: 600;">' + data.serviceName + '</td></tr>' +
    '<tr><td style="padding: 6px 0; color: #6b7280;">Date</td><td style="padding: 6px 0; font-weight: 600;">' + data.appointmentDate + '</td></tr>' +
    '<tr><td style="padding: 6px 0; color: #6b7280;">Time</td><td style="padding: 6px 0; font-weight: 600;">' + data.startTime + '</td></tr>' +
    '</table></div>' +
    '<p style="color: #6b7280; font-size: 14px;">If you need to reschedule or cancel, please contact us at ' + data.businessEmail +
      (data.businessPhone ? ' or ' + data.businessPhone : '') + '.</p>' +
    '<p style="color: #6b7280; font-size: 14px; margin-top: 24px;">See you soon.</p>' +
    '</div></body></html>'

  const text = 'Appointment Reminder\n\n' +
    'Hi ' + data.customerName + ',\n\n' +
    'This is a reminder for your upcoming appointment ' + data.timeUntil + '.\n\n' +
    'Business: ' + data.businessName + '\n' +
    'Service: ' + data.serviceName + '\n' +
    'Date: ' + data.appointmentDate + '\n' +
    'Time: ' + data.startTime + '\n\n' +
    'Contact: ' + data.businessEmail

  return { subject, html, text }
}
