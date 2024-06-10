import { NextFunction, Request, Response } from 'express';
import jwtLib from '../library/jwt.server.library';
import { JwtPayload } from 'jsonwebtoken';
import User, { UserType } from '../database/models/user';

declare global {
  namespace Express {
    interface Request {
      user: UserType;
    }
  }
}

const isAuthenticated = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const token = req.cookies['secret-token'];

  try {
    if (!token) {
      const error = new Error('Unauthorized');
      Object.assign(error, { statusCode: 401 });
      return next(error);
    }

    const decoded = jwtLib.verifyToken(token, next);

    const userId = (decoded as JwtPayload).userId;

    const user = await User.findById(userId.toString());

    if (user) {
      req.user = user;
    }

    next();
  } catch (err) {
    const error = new Error('Unauthorized');
    Object.assign(error, { statusCode: 401 });
    return next(error);
  }
};

export default isAuthenticated;
