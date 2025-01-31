import nodemailer from 'nodemailer';

export async function sendEmailNotification(data) {
  const { 
    EMAIL_HOST,
    EMAIL_PORT,
    EMAIL_USER,
    EMAIL_PASS,
    EMAIL_FROM,
    EMAIL_TO
  } = process.env;

  if (!EMAIL_HOST || !EMAIL_USER || !EMAIL_PASS || !EMAIL_TO) {
    console.warn('Email credentials not configured');
    return;
  }

  const transporter = nodemailer.createTransport({
    host: EMAIL_HOST,
    port: EMAIL_PORT || 587,
    secure: false,
    auth: {
      user: EMAIL_USER,
      pass: EMAIL_PASS
    }
  });

  const emailContent = `
    <h2>New Visit Detected</h2>
    <p><strong>Time:</strong> ${data.timestamp}</p>
    <p><strong>IP Address:</strong> ${data.ipAddress}</p>
    <p><strong>Platform:</strong> ${data.platform}</p>
    <p><strong>Screen Resolution:</strong> ${data.screenResolution}</p>
    <p><strong>Language:</strong> ${data.language}</p>
    <p><strong>Timezone:</strong> ${data.timeZone}</p>
    <p><strong>Cookies Enabled:</strong> ${data.cookiesEnabled ? 'Yes' : 'No'}</p>
  `;

  try {
    await transporter.sendMail({
      from: EMAIL_FROM || EMAIL_USER,
      to: EMAIL_TO,
      subject: 'New Website Visit Detected',
      html: emailContent
    });
  } catch (error) {
    console.error('Error sending email notification:', error);
    throw error;
  }
}