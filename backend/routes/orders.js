import express from 'express';
import {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  cancelOrder
} from '../controllers/orderController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { orderValidationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

router.post('/', authenticate, orderValidationRules(), handleValidationErrors, placeOrder);
router.get('/', authenticate, getMyOrders);
router.get('/all', authenticate, authorize, getAllOrders);
router.get('/:id', authenticate, getOrderById);
router.put('/:id', authenticate, authorize, updateOrder);
router.patch('/:id/status', authenticate, authorize, updateOrderStatus);
router.delete('/:id', authenticate, cancelOrder);

export default router;
