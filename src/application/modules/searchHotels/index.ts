import { Application } from 'express';

import searchController from './search.server.controller';

export default function (app: Application): void {
  app.get('/api/hotels/search', searchController.searchHotels);
}
