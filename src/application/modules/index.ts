import { Application } from 'express';

import users from './users';
import auth from './auth';
import hotels from './hotels';

export default (app: Application): void => {
  // /api/users
  users(app);

  // /api/auth
  auth(app);

  // /api/my-hotels
  hotels(app);
};
