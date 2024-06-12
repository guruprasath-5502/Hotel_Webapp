import { body } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateCreateHotelRequest = [
  body('name').notEmpty().withMessage('Name is required'),
  body('city').notEmpty().withMessage('City is required'),
  body('country').notEmpty().withMessage('Country is required'),
  body('description').notEmpty().withMessage('Description is required'),
  body('type').notEmpty().withMessage('Hotel Type is required'),
  body('facilities').isArray().withMessage('Facilities are required'),
  body('pricePerNight')
    .notEmpty()
    .isNumeric()
    .withMessage('Price is required and must be a number'),
  body('adultCount')
    .notEmpty()
    .isNumeric()
    .withMessage('Adult Count is required and must be a number'),
  body('childCount')
    .notEmpty()
    .isNumeric()
    .withMessage('Child Count is required and must be a number'),
  handleValidationErrors,
];
