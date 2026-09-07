import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { parsePagination } from '../../utils/helpers.js';
import {
  createOrderSchema,
  orderIdSchema,
  cancelOrderSchema,
  listOrdersSchema,
} from './orders.validation.js';
import * as ordersController from './orders.controller.js';

const router = Router();

router.use(authenticate);

router.post('/', validate(createOrderSchema), asyncHandler(ordersController.create));

router.get(
  '/',
  validate(listOrdersSchema, 'query'),
  (req, res, next) => {
    req.pagination = parsePagination(req.query, 12, 100);
    next();
  },
  asyncHandler(ordersController.listMine)
);

router.get(
  '/:id',
  validate(orderIdSchema, 'params'),
  asyncHandler(ordersController.getById)
);

router.patch(
  '/:id/cancel',
  validate(orderIdSchema, 'params'),
  validate(cancelOrderSchema),
  asyncHandler(ordersController.cancel)
);

export default router;
