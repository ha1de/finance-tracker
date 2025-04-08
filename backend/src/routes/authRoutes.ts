// backend/src/routes/authRoutes.ts
import { Router, RequestHandler } from 'express'; // Ensure RequestHandler is imported
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController';
import { registerValidation, loginValidation } from './validators/authValidators'; // Ensure correct path
import { protect } from '../middleware/authMiddleware'; // Your protect middleware

const router = Router();

// Public routes (Spread syntax if register/loginValidation are arrays)
router.post('/register', ...registerValidation, registerUser as RequestHandler);
router.post('/login', ...loginValidation, loginUser as RequestHandler);

// Protected route
// --- FIX: Add 'as RequestHandler' cast to 'protect' middleware AS WELL ---
router.get('/me', protect as RequestHandler, getCurrentUser as RequestHandler);
// --- END FIX ---

export default router;