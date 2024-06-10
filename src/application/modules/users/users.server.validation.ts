import { body } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateUserRegistrationRequest = [
  body('firstName')
    .isString()
    .notEmpty()
    .withMessage('First Name must be a string'),
  body('lastName')
    .isString()
    .notEmpty()
    .withMessage('Last Name must be a string'),
  body('email').isEmail().withMessage('Valid Email required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be minimum 6 length'),
  handleValidationErrors,
];
