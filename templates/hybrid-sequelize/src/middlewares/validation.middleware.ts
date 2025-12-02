import { Request, Response, NextFunction } from 'express';
import { ValidationError } from '../core/errors/index.js';
import { ZodSchema } from 'zod';

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

/**
 * Validate request data against a Zod schema
 * Throws ValidationError if validation fails
 */
export const validateRequest = <T>(schema: ZodSchema<T>, data: unknown): T => {
  const result = schema.safeParse(data);
  
  if (!result.success) {
    const errors = result.error.errors.map((err) => ({
      field: err.path.join('.'),
      message: err.message,
    }));
    throw new ValidationError(errors[0]?.message || 'Validation failed');
  }
  
  return result.data;
};
