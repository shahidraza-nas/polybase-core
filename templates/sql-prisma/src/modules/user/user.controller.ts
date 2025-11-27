import { Request, Response, NextFunction } from 'express';
import { userService } from './user.service.js';
import { ApiResponse } from '../../core/utils/response.util.js';
import { asyncHandler } from '../../core/decorators/async-handler.decorator.js';

export class UserController {
  create = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.create(req.body);
    return ApiResponse.created(res, user, 'User created successfully');
  });

  findAll = asyncHandler(async (req: Request, res: Response) => {
    const page = parseInt(req.query.page as string) || 1;
    const limit = parseInt(req.query.limit as string) || 10;

    const result = await userService.findAll(page, limit);
    return ApiResponse.success(res, result);
  });

  findById = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.findById(req.params.id);
    return ApiResponse.success(res, user);
  });

  update = asyncHandler(async (req: Request, res: Response) => {
    const user = await userService.update(req.params.id, req.body);
    return ApiResponse.success(res, user, 'User updated successfully');
  });

  delete = asyncHandler(async (req: Request, res: Response) => {
    const result = await userService.delete(req.params.id);
    return ApiResponse.success(res, result);
  });
}

export const userController = new UserController();
