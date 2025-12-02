import { Router } from 'express';
import { authRoutes } from './modules/auth/index.js';
import userRoutes from './modules/user/user.routes.js';

const router = Router();

/* API info */
router.get('/', (req, res) => {
  res.json({ 
    message: 'Welcome to the API',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      health: '/health'
    }
  });
});

/* Module routes */
router.use('/auth', authRoutes);
router.use('/users', userRoutes);

export default router;
