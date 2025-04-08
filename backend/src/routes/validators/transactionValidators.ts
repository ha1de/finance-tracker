// backend/src/routes/validators/transactionValidators.ts
import { body } from 'express-validator';
// --- FIX: Import Enum directly ---
import { TransactionType } from '@prisma/client';
// --- END FIX ---

// --- FIX: Use direct enum ---
const validTypes = Object.values(TransactionType);
// --- END FIX ---

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