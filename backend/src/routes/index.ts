// backend/src/routes/index.ts
import { Router } from 'express';
import authRoutes from './authRoutes';
import transactionRoutes from './transactionRoutes';

const router = Router();

// Mount the specific routers
router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);

// Add a simple health check route
router.get('/health', (req, res) => {
    res.status(200).json({ status: 'UP', timestamp: new Date().toISOString() });
});


export default router;