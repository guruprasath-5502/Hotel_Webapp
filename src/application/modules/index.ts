import { Application } from 'express';

import users from './users';
import auth from './auth';

export default (app: Application): void => {
  // /api/users
  users(app);

  // /api/auth
  auth(app);
};
