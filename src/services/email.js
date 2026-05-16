const nodemailer = require('nodemailer');

function createTransport() {
  return nodemailer.createTransport({
    host: process.env.SMTP_HOST || 'smtp.gmail.com',
    port: parseInt(process.env.SMTP_PORT || '587', 10),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
}

async function sendNotificationEmail(contact) {
  const transporter = createTransport();
  const notifyEmail = process.env.NOTIFY_EMAIL || process.env.SMTP_USER;

  await transporter.sendMail({
    from: `"Banker Wiz" <${process.env.SMTP_USER}>`,
    to: notifyEmail,
    subject: `New Signup: ${contact.name}`,
    html: `
      <h2>New Service Signup</h2>
      <p><strong>Name:</strong> ${contact.name}</p>
      <p><strong>Email:</strong> ${contact.email}</p>
      ${contact.phone ? `<p><strong>Phone:</strong> ${contact.phone}</p>` : ''}
      ${contact.message ? `<p><strong>Message:</strong> ${contact.message}</p>` : ''}
      <p><strong>Submitted:</strong> ${contact.submittedAt}</p>
    `
  });
}

module.exports = { sendNotificationEmail };
