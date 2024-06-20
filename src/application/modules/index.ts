import { Application } from 'express';

import users from './users';
import auth from './auth';
import hotels from './hotels';
import searchHotels from './searchHotels';
import bookings from './bookings';

export default (app: Application): void => {
  // /api/users
  users(app);

  // /api/auth
  auth(app);

  // /api/my-hotels
  hotels(app);

  // /api/hotels/search
  searchHotels(app);

  // /api/hotels/:hotelId/bookings
  bookings(app);
};
