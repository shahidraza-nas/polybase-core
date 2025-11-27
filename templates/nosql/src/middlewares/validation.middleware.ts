import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../core/errors/app-error.js';

export const validate = (schema: any) => {
  return async (req: Request, res: Response, next: NextFunction) => {
    try {
      const validated = await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });

      req.body = validated.body;
      req.query = validated.query;
      req.params = validated.params;

      next();
    } catch (error: any) {
      const errors = error.errors?.map((err: any) => ({
        field: err.path.join('.'),
        message: err.message,
      }));

      next(new ValidationError(errors?.[0]?.message || 'Validation failed'));
    }
  };
};
