import nodemailer from 'nodemailer'

interface EmailPayload {
  to: string
  subject: string
  html: string
  text: string
}

function createTransporter() {
  const host = process.env.EMAIL_SERVER_HOST
  const port = process.env.EMAIL_SERVER_PORT
  const user = process.env.EMAIL_SERVER_USER
  const pass = process.env.EMAIL_SERVER_PASSWORD

  if (!host || !user || !pass) {
    return null
  }

  return nodemailer.createTransport({
    host,
    port: Number(port ?? 587),
    secure: Number(port) === 465,
    auth: { user, pass },
  })
}

export async function sendEmail(payload: EmailPayload): Promise<boolean> {
  const transporter = createTransporter()

  if (!transporter) {
    console.warn('[EMAIL] Email not configured. Skipping send.')
    console.warn('[EMAIL] Would have sent to:', payload.to)
    console.warn('[EMAIL] Subject:', payload.subject)
    return false
  }

  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM ?? 'noreply@schedulr.com',
      to: payload.to,
      subject: payload.subject,
      html: payload.html,
      text: payload.text,
    })
    console.log('[EMAIL] Sent to:', payload.to)
    return true
  } catch (error) {
    console.error('[EMAIL] Failed to send:', error)
    return false
  }
}
