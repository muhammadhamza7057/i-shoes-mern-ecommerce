import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { addCartItemSchema, updateCartItemSchema, cartItemIdSchema } from './cart.validation.js';
import * as cartController from './cart.controller.js';

const router = Router();

router.use(authenticate);

router.get('/', asyncHandler(cartController.getCart));
router.post('/', validate(addCartItemSchema), asyncHandler(cartController.addItem));
router.delete('/', asyncHandler(cartController.clearCart));
router.patch(
  '/:itemId',
  validate(cartItemIdSchema, 'params'),
  validate(updateCartItemSchema),
  asyncHandler(cartController.updateItem)
);
router.delete(
  '/:itemId',
  validate(cartItemIdSchema, 'params'),
  asyncHandler(cartController.removeItem)
);

export default router;
