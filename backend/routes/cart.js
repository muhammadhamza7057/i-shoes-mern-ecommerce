import express from 'express';
import {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
} from '../controllers/cartController.js';
import { authenticate } from '../middleware/auth.js';

const router = express.Router();

router.get('/', authenticate, getCart);
router.post('/add', authenticate, addToCart);
router.patch('/:itemId', authenticate, updateCartItem);
router.delete('/:itemId', authenticate, removeCartItem);
router.delete('/', authenticate, clearCart);

export default router;
