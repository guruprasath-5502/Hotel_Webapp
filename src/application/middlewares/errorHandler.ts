import { NextFunction, Request, Response } from 'express';

export interface CustomError extends Error {
  statusCode?: number;
}

export const handleError = (
  err: CustomError,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!err.statusCode) {
    err.statusCode = 500;
  }

  console.log(err);

  return res.status(err.statusCode).json({
    status: false,
    error: {
      statusCode: err.statusCode,
      message: err.message,
    },
  });
};

export const apiNotFound = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const error = new Error('Not Found');
  Object.assign(error, { statusCode: 404 });
  next(error);
};
