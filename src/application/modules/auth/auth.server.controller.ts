import { NextFunction, Request, Response } from 'express';
import User from '../../database/models/user';
import { verifyPassword } from '../../library/bcryptjs.server.library';
import jwtLib from '../../library/jwt.server.library';

const login = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      const err = new Error('Invalid Credentials');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    const isMatch = await verifyPassword(password, user.password);

    if (!isMatch) {
      const err = new Error('Invalid Credentials');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    jwtLib.generateToken(user._id.toString(), res);

    return res
      .status(200)
      .json({ status: true, data: { userId: user._id.toString() } });
  } catch (error) {
    next(new Error('Unable to login'));
  }
};

const validateToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  return res
    .status(200)
    .json({ status: true, data: { userId: req.user?._id } });
};

const logout = async (req: Request, res: Response, next: NextFunction) => {
  res.clearCookie('secret-token', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
  });

  return res
    .status(200)
    .json({ status: true, data: { message: 'User Logged Out Successfully' } });
};

const authController = { login, validateToken, logout };

export default authController;
