import express from 'express';
import { register, login, me, updateProfile } from '../controllers/authController.js';
import { authenticate } from '../middleware/auth.js';
import { authValidationRules, loginValidationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/register', authValidationRules(), handleValidationErrors, register);
router.post('/login', loginValidationRules(), handleValidationErrors, login);
router.get('/me', authenticate, me);
router.patch('/me', authenticate, updateProfile);

export default router;
