export function bookingConfirmationTemplate(data: {
  customerName: string
  businessName: string
  serviceName: string
  appointmentDate: string
  startTime: string
  endTime: string
  businessEmail: string
  businessPhone?: string | null
}): { subject: string; html: string; text: string } {
  const subject = 'Booking Confirmed - ' + data.businessName

  const html = ` 
    <!DOCTYPE html>
    <html>
    <head><meta charset='utf-8'></head>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;'>
      <div style='background: #2563eb; padding: 24px; border-radius: 8px 8px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 24px;'>Booking Confirmed</h1>
      </div>
      <div style='border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;'>
        <p style='font-size: 16px;'>Hi ${data.customerName},</p>
        <p>Your appointment has been confirmed. Here are your booking details:</p>
        <div style='background: #f9fafb; border-radius: 8px; padding: 16px; margin: 16px 0;'>
          <table style='width: 100%; border-collapse: collapse;'>
            <tr><td style='padding: 6px 0; color: #6b7280; width: 40%;'>Business</td><td style='padding: 6px 0; font-weight: 600;'>${data.businessName}</td></tr>
            <tr><td style='padding: 6px 0; color: #6b7280;'>Service</td><td style='padding: 6px 0; font-weight: 600;'>${data.serviceName}</td></tr>
            <tr><td style='padding: 6px 0; color: #6b7280;'>Date</td><td style='padding: 6px 0; font-weight: 600;'>${data.appointmentDate}</td></tr>
            <tr><td style='padding: 6px 0; color: #6b7280;'>Time</td><td style='padding: 6px 0; font-weight: 600;'>${data.startTime} - ${data.endTime}</td></tr>
          </table>
        </div>
        <p style='color: #6b7280; font-size: 14px;'>If you need to make changes, please contact us at ${data.businessEmail}${data.businessPhone ? ' or ' + data.businessPhone : ''}.</p>
        <p style='color: #6b7280; font-size: 14px; margin-top: 24px;'>Thank you for booking with ${data.businessName}.</p>
      </div>
    </body>
    </html>
  ` 

  const text = 'Booking Confirmed - ' + data.businessName + '\n\n' +
    'Hi ' + data.customerName + ',\n\n' +
    'Your appointment has been confirmed.\n\n' +
    'Business: ' + data.businessName + '\n' +
    'Service: ' + data.serviceName + '\n' +
    'Date: ' + data.appointmentDate + '\n' +
    'Time: ' + data.startTime + ' - ' + data.endTime + '\n\n' +
    'Contact: ' + data.businessEmail

  return { subject, html, text }
}

export function bookingCancellationTemplate(data: {
  customerName: string
  businessName: string
  serviceName: string
  appointmentDate: string
  startTime: string
}): { subject: string; html: string; text: string } {
  const subject = 'Booking Cancelled - ' + data.businessName

  const html = ` 
    <!DOCTYPE html>
    <html>
    <head><meta charset='utf-8'></head>
    <body style='font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; color: #333;'>
      <div style='background: #dc2626; padding: 24px; border-radius: 8px 8px 0 0;'>
        <h1 style='color: white; margin: 0; font-size: 24px;'>Booking Cancelled</h1>
      </div>
      <div style='border: 1px solid #e5e7eb; border-top: none; padding: 24px; border-radius: 0 0 8px 8px;'>
        <p>Hi ${data.customerName}, your appointment on ${data.appointmentDate} at ${data.startTime} for ${data.serviceName} has been cancelled.</p>
        <p style='color: #6b7280; font-size: 14px;'>We hope to see you again soon at ${data.businessName}.</p>
      </div>
    </body>
    </html>
  ` 

  const text = 'Booking Cancelled\n\nHi ' + data.customerName + ', your appointment on ' + data.appointmentDate + ' at ' + data.startTime + ' has been cancelled.'

  return { subject, html, text }
}
