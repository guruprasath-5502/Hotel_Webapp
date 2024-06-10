import { NextFunction, Request, Response } from 'express';

const logger = (req: Request, res: Response, next: NextFunction) => {
  console.log(
    `${req.method} ${req.protocol}://${req.headers.host}${req.originalUrl}`
  );

  next();
};

export default logger;
