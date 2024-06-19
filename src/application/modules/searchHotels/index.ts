import { Application } from 'express';

import searchController from './search.server.controller';
import { validateGetHotelRequest } from './search.server.validation';

export default function (app: Application): void {
  app.get(
    '/api/hotels/search/:id',
    validateGetHotelRequest,
    searchController.searchSingleHotel
  );

  app.get('/api/hotels/search', searchController.searchHotels);
}
