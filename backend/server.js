import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import urlRoutes from './routes/urls.js';
import { redirectToOriginal } from './controllers/urlController.js';

// Load environment variables ONCE
dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? process.env.FRONTEND_URL 
    : ['http://localhost:5173', 'http://localhost:3000'],
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// API routes
app.use('/api', urlRoutes);

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Redirect endpoint - must be after API routes
app.get('/:shortCode', redirectToOriginal);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

// Start server
app.listen(PORT, () => {
  console.log(`🚀 URL Shortener API running on http://localhost:${PORT}`);
  console.log(`📋 API endpoints available at http://localhost:${PORT}/api`);
});