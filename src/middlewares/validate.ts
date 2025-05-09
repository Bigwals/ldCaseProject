import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export const validate = (schema: ZodSchema<any>) => (
  req: Request,
  res: Response,
  next: NextFunction
): any => {
  try {
    schema.parse(req.body);
    next();
  } catch (err: any) {
    return res.status(400).json({ message: 'Validation Error', errors: err.errors });
  }
};