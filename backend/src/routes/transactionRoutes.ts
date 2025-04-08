// backend/src/routes/transactionRoutes.ts
import { Router, RequestHandler } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { transactionValidation } from './validators/transactionValidators'; // Array of validation middleware
import { protect } from '../middleware/authMiddleware';

const router = Router();

// Apply protect middleware to all routes in this file
router.use(protect as RequestHandler); // Also cast protect here for consistency

// Define routes
// --- FIX: Remove spread operator, pass array directly ---
router.post('/', transactionValidation, createTransaction as RequestHandler); // Pass array directly
router.get('/', getTransactions as RequestHandler);
router.get('/:id', getTransactionById as RequestHandler);
router.put('/:id', transactionValidation, updateTransaction as RequestHandler); // Pass array directly
router.patch('/:id', updateTransaction as RequestHandler);
router.delete('/:id', deleteTransaction as RequestHandler);
// --- END FIX ---

export default router;