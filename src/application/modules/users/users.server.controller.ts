import crypto from 'crypto';

import { NextFunction, Request, Response } from 'express';

import User, { UserType } from '../../database/models/user';
import bcryptLib from '../../library/bcryptjs.server.library';
import jwtLib from '../../library/jwt.server.library';

const register = async (req: Request, res: Response, next: NextFunction) => {
  const data: UserType = req.body;

  try {
    const user = await User.findOne({
      email: data.email,
    });

    if (user) {
      const err = new Error('User already exists');
      Object.assign(err, { statusCode: 400 });
      return next(err);
    }

    const salt = await bcryptLib.generateSalt();
    const hashedPassword = await bcryptLib.hashPassword(data.password, salt);

    data.password = hashedPassword;
    data.salt = salt;

    const token = crypto.randomBytes(20).toString('hex');

    data.verifyToken = token;

    const newUser = new User(data);

    await newUser.save();

    jwtLib.generateToken(newUser._id.toString(), res);

    return res
      .status(201)
      .json({ status: true, data: { userId: newUser._id.toString() } });
  } catch (error) {
    next(new Error('Error registering user'));
  }
};

const userController = { register };

export default userController;
