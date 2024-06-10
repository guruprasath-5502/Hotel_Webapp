import { body } from 'express-validator';
import { handleValidationErrors } from '../../middlewares/validator';

export const validateLoginRequest = [
  body('email').isEmail().withMessage('Email is required'),
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be minimum 6 length'),
  handleValidationErrors,
];
