import { Router } from 'express';

const router = Router();

// Root route
router.get('/', (req, res) => {
  res.json({ 
    message: 'NoSQL API is running',
    version: '1.0.0',
    endpoints: {
      health: '/health',
      api: '/api'
    }
  });
});

export default router;
