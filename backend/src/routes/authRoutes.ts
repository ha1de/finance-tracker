import { Router, RequestHandler } from 'express';
import { registerUser, loginUser, getCurrentUser } from '../controllers/authController';
import { registerValidation, loginValidation } from './validators/authValidators';
import { protect } from '../middleware/authMiddleware';

const router = Router();

router.post('/register', ...registerValidation, registerUser as RequestHandler);
router.post('/login', ...loginValidation, loginUser as RequestHandler);

// Protected route
router.get('/me', protect as RequestHandler, getCurrentUser as RequestHandler);

export default router;
