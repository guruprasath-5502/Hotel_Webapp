import jwt from 'jsonwebtoken';
import 'dotenv/config';

import { NextFunction, Response } from 'express';

const generateToken = (userId: string, res: Response): void => {
  const token = jwt.sign({ userId }, <string>process.env.JWT_SECRET_KEY, {
    expiresIn: '1d',
  });

  res.cookie('secret-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    maxAge: 24 * 60 * 60 * 1000,
  });

  return;
};

const verifyToken = (token: string, next: NextFunction) => {
  try {
    const decoded = jwt.verify(token, <string>process.env.JWT_SECRET_KEY);
    return decoded;
  } catch (error) {
    const err = new Error('Unauthorized');
    Object.assign(err, { statusCode: 401 });
    return next(err);
  }
};

const jwtLib = {
  generateToken,
  verifyToken,
};

export default jwtLib;
