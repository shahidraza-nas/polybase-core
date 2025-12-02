import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { config } from '../config/env.config.js';
import { UnauthorizedError } from '../core/errors/index.js';
import { asyncHandler } from '../core/decorators/index.js';

interface JwtPayload {
  userId: string;
  email: string;
}

// Extend Express Request type to include user
declare global {
  namespace Express {
    interface Request {
      user?: JwtPayload;
    }
  }
}

/**
 * Authentication middleware
 * Verifies JWT token from Authorization header
 */
export const authenticate = asyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    // Get token from header
    const authHeader = req.headers.authorization;

    if (!authHeader || !authHeader.startsWith('Bearer ')) {
      throw new UnauthorizedError('No token provided');
    }

    const token = authHeader.substring(7); // Remove 'Bearer ' prefix

    try {
      // Verify token
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      
      // Attach user to request
      req.user = decoded;
      
      next();
    } catch (error) {
      throw new UnauthorizedError('Invalid or expired token');
    }
  }
);

/**
 * Optional authentication middleware
 * Attaches user if token is valid, but doesn't throw error if missing
 */
export const optionalAuth = async (req: Request, res: Response, next: NextFunction) => {
  const authHeader = req.headers.authorization;

  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.substring(7);

    try {
      const decoded = jwt.verify(token, config.jwtSecret) as JwtPayload;
      req.user = decoded;
    } catch (error) {
      // Token invalid, but we don't throw error
      // User will be undefined
    }
  }

  next();
};
