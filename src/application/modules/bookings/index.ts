import { Application } from 'express';
import isAuthenticated from '../../middlewares/auth';
import bookingsController from './bookings.server.controller';

export default function (app: Application): void {
  app.post(
    '/api/hotels/:hotelId/bookings/payment-intent',
    isAuthenticated,
    bookingsController.paymentIntent
  );

  app.post(
    '/api/hotels/:hotelId/bookings',
    isAuthenticated,
    bookingsController.createBooking
  );
}
