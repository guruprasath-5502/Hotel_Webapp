import { param } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateGetHotelRequest = [
  param('id').notEmpty().withMessage('Hotel Id is required'),
  handleValidationErrors,
];
