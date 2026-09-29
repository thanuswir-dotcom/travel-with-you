import express from 'express';
import cors from 'cors';
import { config } from './config/index.js';
import apiRouter from './routes/index.js';
import { requestLogger } from './middleware/logger.js';
import { errorHandler } from './middleware/errorHandler.js';

const app = express();

// Global Middleware
app.use(cors({ origin: config.corsOrigin }));
app.use(express.json({ limit: '10mb' }));
app.use(requestLogger);

// Welcome / Root route
app.get('/', (req, res) => {
  res.json({
    app: 'Travel With You Backend API 🚀',
    tagline: 'Discover more. Spend less. Make memories.',
    status: 'online',
    healthCheck: '/api/health',
    endpoints: {
      places: '/api/places',
      weather: '/api/weather',
      aiChat: '/api/ai/chat',
      aiPlan: '/api/ai/plan'
    },
    frontendUrl: 'https://travel-with-you.vercel.app'
  });
});

// Mount API router
app.use('/api', apiRouter);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    error: 'Endpoint Not Found',
    path: req.originalUrl,
    method: req.method
  });
});

// Centralized error handler
app.use(errorHandler);

export default app;
