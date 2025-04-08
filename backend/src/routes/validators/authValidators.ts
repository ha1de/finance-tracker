// backend/src/routes/validators/authValidators.ts
import { body } from 'express-validator';

export const registerValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
  body('name').optional().trim().escape(), // Optional name, trim whitespace and escape HTML chars
];

export const loginValidation = [
  body('email').isEmail().withMessage('Please provide a valid email address').normalizeEmail(),
  body('password').exists().withMessage('Password is required'),
];