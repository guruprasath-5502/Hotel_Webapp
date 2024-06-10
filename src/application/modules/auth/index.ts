import { Application } from 'express';

import authController from './auth.server.controller';
import { validateLoginRequest } from './auth.server.validation';
import isAuthenticated from '../../middlewares/auth';

export default function (app: Application): void {
  app.post('/api/auth/login', validateLoginRequest, authController.login);

  app.get(
    '/api/auth/validate-token',
    isAuthenticated,
    authController.validateToken
  );

  app.post('/api/auth/logout', authController.logout);
}
