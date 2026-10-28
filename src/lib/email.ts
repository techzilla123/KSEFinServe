// Frontend helper: send email via the Netlify Function (Brevo).
// Usage: await sendEmail({ to: 'admin@ksefinserve.com', subject: 'New booking', html: '<p>Details...</p>' })

const FUNCTION_URL = '/.netlify/functions/send-email'

export interface SendEmailParams {
  to: string | string[]
  subject: string
  html: string
  text?: string
  fromName?: string
  replyTo?: string
}

export interface SendEmailResult {
  ok: boolean
  messageId?: string
  error?: string
  code?: string
}

export async function sendEmail(params: SendEmailParams): Promise<SendEmailResult> {
  try {
    const res = await fetch(FUNCTION_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(params),
    })

    const data = await res.json()

    if (!res.ok) {
      return { ok: false, error: data.error ?? 'Failed to send', code: data.code }
    }

    return { ok: true, messageId: data.messageId }
  } catch (e) {
    return { ok: false, error: e instanceof Error ? e.message : 'Network error' }
  }
}

// Convenience: send booking confirmation to user + admin notification
export async function sendBookingConfirmation(params: {
  userEmail: string
  userName: string
  bookingDate: string
  bookingTime: string
  serviceType: string
  adminEmail?: string
}): Promise<{ user: SendEmailResult; admin: SendEmailResult }> {
  const adminEmail = params.adminEmail ?? 'admin@ksefinserve.com'

  const userHtml = `
    <p>Hi ${params.userName},</p>
    <p>Your <strong>${params.serviceType}</strong> session is confirmed for <strong>${params.bookingDate} at ${params.bookingTime}</strong>.</p>
    <p>We'll send a calendar invite and meeting link shortly.</p>
    <p>— The KSEFinServe Team</p>
  `

  const adminHtml = `
    <p>New booking received:</p>
    <ul>
      <li><strong>Client:</strong> ${params.userName} (${params.userEmail})</li>
      <li><strong>Service:</strong> ${params.serviceType}</li>
      <li><strong>When:</strong> ${params.bookingDate} at ${params.bookingTime}</li>
    </ul>
  `

  const [user, admin] = await Promise.all([
    sendEmail({ to: params.userEmail, subject: 'Booking Confirmed — KSEFinServe', html: userHtml }),
    sendEmail({ to: adminEmail, subject: 'New Booking — KSEFinServe', html: adminHtml }),
  ])

  return { user, admin }
}

// Convenience: send contact form notification to admin
export async function sendContactNotification(params: {
  name: string
  email: string
  message: string
  adminEmail?: string
}): Promise<SendEmailResult> {
  const adminEmail = params.adminEmail ?? 'admin@ksefinserve.com'

  const html = `
    <p>New contact form submission:</p>
    <ul>
      <li><strong>Name:</strong> ${params.name}</li>
      <li><strong>Email:</strong> ${params.email}</li>
    </ul>
    <p><strong>Message:</strong></p>
    <p>${params.message.replace(/\n/g, '<br>')}</p>
  `

  return sendEmail({
    to: adminEmail,
    subject: `Contact Form: ${params.name}`,
    html,
    replyTo: params.email,
  })
}