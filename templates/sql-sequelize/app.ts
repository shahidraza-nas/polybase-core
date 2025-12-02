/* Load environment variables first */
import { config } from './src/config/index.js';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import routes from './src/routes.js';
import { errorHandler, notFoundHandler, requestLogger } from './src/middlewares/index.js';

const app = express();

/* Security middleware */
app.use(helmet());
app.use(cors({ origin: config.corsOrigin }));

/* Rate limiting */
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, /* 15 minutes */
  max: 100, /* Limit each IP to 100 requests per windowMs */
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});
app.use(limiter);

// Body parser middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request logging
app.use(requestLogger);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'ok', 
    mode: 'SQL',
    orm: 'Sequelize',
    timestamp: new Date().toISOString(),
    environment: config.nodeEnv
  });
});

// API routes
app.use('/api', routes);

// Error handling
app.use(notFoundHandler);
app.use(errorHandler);

export default app;
