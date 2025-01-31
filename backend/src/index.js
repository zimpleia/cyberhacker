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
  methods: ['POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Track visit endpoint
app.post('/api/track', async (req, res) => {
  try {
    const trackingData = req.body;

    // Send notifications in parallel
    await Promise.all([
      sendTelegramNotification(trackingData),
      sendEmailNotification(trackingData)
    ]);

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