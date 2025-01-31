export async function sendTelegramNotification(data) {
  const { TELEGRAM_BOT_TOKEN, TELEGRAM_CHAT_ID } = process.env;
  
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) {
    console.warn('Telegram credentials not configured');
    return;
  }

  const message = `
🔥 New Visit Detected 🔥
📅 Time: ${data.timestamp}
🌐 IP: ${data.ipAddress}
🖥️ Platform: ${data.platform}
📱 Screen: ${data.screenResolution}
🌍 Language: ${data.language}
⏰ Timezone: ${data.timeZone}
🍪 Cookies: ${data.cookiesEnabled ? 'Enabled' : 'Disabled'}
`;

  try {
    const response = await fetch(
      `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          chat_id: TELEGRAM_CHAT_ID,
          text: message,
          parse_mode: 'Markdown'
        })
      }
    );

    if (!response.ok) {
      throw new Error(`Telegram API error: ${response.statusText}`);
    }
  } catch (error) {
    console.error('Error sending Telegram notification:', error);
    throw error;
  }
}