import { NextFunction, Request, Response } from 'express';
import { validationResult } from 'express-validator';

export const handleValidationErrors = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    Object.assign(errors, {
      message: errors.array(),
    });

    Object.assign(errors, { statusCode: 400 });

    return next(errors);
  }

  next();
};
