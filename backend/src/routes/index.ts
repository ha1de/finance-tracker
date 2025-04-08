import { Router } from 'express';
import authRoutes from './authRoutes';
import transactionRoutes from './transactionRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

// Health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});

export default router;
