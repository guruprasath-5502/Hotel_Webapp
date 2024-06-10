import { Application } from 'express';

import userController from './users.server.controller';
import { validateUserRegistrationRequest } from './users.server.validation';

export default function (app: Application): void {
  app.post(
    '/api/users/register',
    validateUserRegistrationRequest,
    userController.register
  );
}
