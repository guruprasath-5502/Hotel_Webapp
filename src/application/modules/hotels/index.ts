import { Application } from 'express';

import hotelController from './hotels.server.controller';
import { upload } from '../../../config/multerConfig';
import isAuthenticated from '../../middlewares/auth';
import { validateCreateHotelRequest } from './hotel.server.validation';

export default function (app: Application): void {
  app.post(
    '/api/my-hotels',
    isAuthenticated,
    upload.array('imageFiles', 6),
    validateCreateHotelRequest,
    hotelController.createHotel
  );
}
