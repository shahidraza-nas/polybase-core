import { Request, Response } from 'express';
import { AuthService } from './auth.service.js';
import { ApiResponse } from '../../core/utils/index.js';
import { asyncHandler } from '../../core/decorators/index.js';
import { validateRequest } from '../../middlewares/validation.middleware.js';
import { registerSchema, loginSchema, refreshTokenSchema } from './auth.dto.js';

export class AuthController {
  private authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  /**
   * Register a new user
   * POST /api/auth/register
   */
  register = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = validateRequest(registerSchema, req.body);
    const result = await this.authService.register(validatedData);
    return ApiResponse.created(res, result, 'User registered successfully');
  });

  /**
   * Login user
   * POST /api/auth/login
   */
  login = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = validateRequest(loginSchema, req.body);
    const result = await this.authService.login(validatedData);
    return ApiResponse.success(res, result, 'Login successful');
  });

  /**
   * Refresh access token
   * POST /api/auth/refresh
   */
  refreshToken = asyncHandler(async (req: Request, res: Response) => {
    const validatedData = validateRequest(refreshTokenSchema, req.body);
    const result = await this.authService.refreshToken(validatedData.refreshToken);
    return ApiResponse.success(res, result, 'Token refreshed successfully');
  });

  /**
   * Get current user
   * GET /api/auth/me
   */
  getCurrentUser = asyncHandler(async (req: Request, res: Response) => {
    const userId = (req as any).user?.userId;
    
    if (!userId) {
      return ApiResponse.unauthorized(res, 'Unauthorized');
    }

    const user = await this.authService.getUserById(userId);
    return ApiResponse.success(res, user, 'User retrieved successfully');
  });

  /**
   * Logout user
   * POST /api/auth/logout
   */
  logout = asyncHandler(async (req: Request, res: Response) => {
    /* In a production app, you might want to:
     * 1. Blacklist the token
     * 2. Store tokens in Redis and remove on logout
     * 3. Use short-lived tokens with refresh tokens
     */
    return ApiResponse.success(res, null, 'Logout successful');
  });
}

export const authController = new AuthController();
