import http from 'http';

import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import cookieParser from 'cookie-parser';
import bodyParser from 'body-parser';

import 'dotenv/config';

import routes from '../application/modules/index';
import health from '../application/utils/health';
import logger from '../application/middlewares/logger';
import {
  apiNotFound,
  handleError,
} from '../application/middlewares/errorHandler';

const expressConfig = () => {
  const app = express();

  app.use(helmet());

  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true,
    })
  );

  app.use(cookieParser());
  app.use(bodyParser.json({ limit: '15mb' }));
  app.use(bodyParser.urlencoded({ limit: '15mb', extended: true }));

  app.use(logger);

  app.use('/health', health);

  routes(app);

  app.use(apiNotFound);
  app.use(handleError);

  const server = http.createServer(app);

  return server;
};

export default expressConfig;
