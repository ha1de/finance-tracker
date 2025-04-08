import { Router, RequestHandler } from 'express';
import {
  createTransaction,
  getTransactions,
  getTransactionById,
  updateTransaction,
  deleteTransaction,
} from '../controllers/transactionController';
import { transactionValidation } from './validators/transactionValidators';
import { protect } from '../middleware/authMiddleware';

const router = Router();

// apply protect middleware to all routes
router.use(protect as RequestHandler);

// definina routes
router.post('/', transactionValidation, createTransaction as RequestHandler);
router.get('/', getTransactions as RequestHandler);
router.get('/:id', getTransactionById as RequestHandler);
router.put('/:id', transactionValidation, updateTransaction as RequestHandler);
router.patch('/:id', updateTransaction as RequestHandler);
router.delete('/:id', deleteTransaction as RequestHandler);

export default router;
