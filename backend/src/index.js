import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import { sendTelegramNotification } from './services/telegram.js';
import { sendEmailNotification } from './services/email.js';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(cors({
  origin: process.env.FRONTEND_URL || '*',
  credentials: false,
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Function to get client IP address
function getClientIp(req) {
  // Check various headers that might contain the real IP
  return req.headers['cf-connecting-ip'] || // Cloudflare
         req.headers['x-real-ip'] || // Nginx
         req.headers['x-client-ip'] ||
         req.headers['x-forwarded-for']?.split(',')[0] || // Get first IP if multiple are present
         req.socket.remoteAddress ||
         'Unknown';
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Track visit endpoint
app.post('/api/track', async (req, res) => {
  try {
    const trackingData = {
      ...req.body,
      ip: getClientIp(req)
    };

    // Send notifications in parallel but don't wait for them
    Promise.all([
      sendTelegramNotification(trackingData).catch(console.error),
      sendEmailNotification(trackingData).catch(console.error)
    ]);

    // Respond immediately
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Error tracking visit:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Failed to process tracking data' 
    });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
