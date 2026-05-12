import express from 'express';
import { authenticate } from '../middleware/auth.js';
import { createCheckoutSession } from '../controllers/paymentController.js';

const router = express.Router();

router.post('/stripe/create-checkout-session', authenticate, createCheckoutSession);

export default router;