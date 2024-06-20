import { Application } from 'express';

import userController from './users.server.controller';
import { validateUserRegistrationRequest } from './users.server.validation';
import isAuthenticated from '../../middlewares/auth';

export default function (app: Application): void {
  app.get('/api/users/me', isAuthenticated, userController.current);

  app.post(
    '/api/users/register',
    validateUserRegistrationRequest,
    userController.register
  );
}
