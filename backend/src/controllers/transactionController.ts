// backend/src/controllers/transactionController.ts
import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';
import prisma from '../services/prisma';
// --- FIX: Import Enum directly (should work after generate) ---
import { TransactionType } from '@prisma/client';
// --- END FIX ---

// --- Create Transaction ---
export const createTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return; // Explicit return
  }

  if (!req.user) {
       res.status(401).json({ message: 'Not authorized' });
       return; // Explicit return
  }

  const { description, amount, type, date } = req.body;
  const userId = req.user.id;

  try {
    // --- FIX: Use direct enum ---
    if (!Object.values(TransactionType).includes(type)) {
        res.status(400).json({ message: 'Invalid transaction type' });
        return; // Explicit return
    }
    // --- END FIX ---

    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type: type, // Assign directly now
        date: date ? new Date(date) : new Date(),
        userId,
      },
    });
    res.status(201).json(transaction);
  } catch (error) {
    next(error);
  }
};

// --- Get Transactions for User ---
export const getTransactions = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return; // Explicit return
  }
  const userId = req.user.id;

  try {
    const transactions = await prisma.transaction.findMany({
      where: { userId },
      orderBy: { date: 'desc' },
    });
    res.json(transactions);
  } catch (error) {
    next(error);
  }
};

// --- Get Single Transaction ---
export const getTransactionById = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    if (!req.user) {
        res.status(401).json({ message: 'Not authorized' });
        return; // Explicit return
    }
    const userId = req.user.id;
    const transactionId = parseInt(req.params.id, 10);

    if (isNaN(transactionId)) {
         res.status(400).json({ message: 'Invalid transaction ID' });
         return; // Explicit return
    }

    try {
        const transaction = await prisma.transaction.findUnique({
            where: { id: transactionId },
        });

        if (!transaction || transaction.userId !== userId) {
            res.status(404).json({ message: 'Transaction not found' });
            return; // Explicit return
        }

        res.json(transaction);
    } catch (error) {
        next(error);
    }
};


// --- Update Transaction ---
export const updateTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
     res.status(400).json({ errors: errors.array() });
     return; // Explicit return
  }

  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return; // Explicit return
  }

  const userId = req.user.id;
  const transactionId = parseInt(req.params.id, 10);

  if (isNaN(transactionId)) {
      res.status(400).json({ message: 'Invalid transaction ID' });
      return; // Explicit return
  }

  const { description, amount, type, date } = req.body;

  try {
    const existingTransaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
    });

    if (!existingTransaction || existingTransaction.userId !== userId) {
        res.status(404).json({ message: 'Transaction not found or not authorized to update' });
        return; // Explicit return
    }

     // --- FIX: Use direct enum ---
    if (type && !Object.values(TransactionType).includes(type)) {
        res.status(400).json({ message: 'Invalid transaction type' });
        return; // Explicit return
    }
    // --- END FIX ---

    const updatedTransaction = await prisma.transaction.update({
      where: { id: transactionId },
      data: {
        description: description ?? existingTransaction.description,
        amount: amount ? parseFloat(amount) : existingTransaction.amount,
        type: type ?? existingTransaction.type, // Assign directly
        date: date ? new Date(date) : existingTransaction.date,
      },
    });
    res.json(updatedTransaction);
  } catch (error) {
    next(error);
  }
};

// --- Delete Transaction ---
export const deleteTransaction = async (req: Request, res: Response, next: NextFunction): Promise<void> => {
  if (!req.user) {
     res.status(401).json({ message: 'Not authorized' });
     return; // Explicit return
  }
  const userId = req.user.id;
  const transactionId = parseInt(req.params.id, 10);

   if (isNaN(transactionId)) {
      res.status(400).json({ message: 'Invalid transaction ID' });
      return; // Explicit return
  }

  try {
    const transaction = await prisma.transaction.findUnique({
        where: { id: transactionId }
    });

    if (!transaction || transaction.userId !== userId) {
        res.status(404).json({ message: 'Transaction not found or not authorized to delete' });
        return; // Explicit return
    }

    await prisma.transaction.delete({
      where: { id: transactionId },
    });
    res.status(204).send();
  } catch (error) {
    next(error);
  }
};