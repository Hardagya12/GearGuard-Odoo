
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

/**
 * Send an email
 * @param {Object} options - { to, subject, html }
 */
export async function sendEmail({ to, subject, html }) {
  // fast fail if no credentials
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
      console.log('⚠️ Setup EMAIL_USER and EMAIL_PASS in .env to send real emails.');
      console.log(`[Mock Email] To: ${to}, Subject: ${subject}`);
      return;
  }
  
  try {
     const info = await transporter.sendMail({
        from: `"GearGuard Maintenance" <${process.env.EMAIL_USER}>`,
        to,
        subject,
        html
     });
     console.log('Message sent: %s', info.messageId);
     return info;
  } catch (error) {
     console.error('Error sending email:', error);
     // Don't throw, just log, so we don't block the request creation
  }
}
