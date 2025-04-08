import { body } from 'express-validator';
import { TransactionType } from '@prisma/client';

const validTypes = Object.values(TransactionType);

export const transactionValidation = [
  body('description')
    .trim()
    .notEmpty().withMessage('Description is required')
    .escape(),
  body('amount')
    .isFloat({ gt: 0 }).withMessage('Amount must be a positive number')
    .toFloat(),
  body('type')
    .isIn(validTypes).withMessage(`Type must be one of: ${validTypes.join(', ')}`),
  body('date')
    .optional()
    .isISO8601().withMessage('Date must be a valid ISO 8601 date (YYYY-MM-DD)')
    .toDate(),
];
