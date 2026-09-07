import { Router } from 'express';
import asyncHandler from '../../utils/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { authenticate } from '../../middleware/auth.js';
import { requireAdmin } from '../../middleware/requireAdmin.js';
import {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  createCategorySchema,
  updateCategorySchema,
  listOrdersSchema,
  updateOrderStatusSchema,
  idParamSchema,
} from './admin.validation.js';
import * as adminController from './admin.controller.js';

const router = Router();

router.use(authenticate, requireAdmin);

router.get('/dashboard', asyncHandler(adminController.dashboard));

router.get('/products', validate(listProductsSchema, 'query'), asyncHandler(adminController.listProducts));
router.post('/products', validate(createProductSchema), asyncHandler(adminController.createProduct));
router.patch(
  '/products/:id',
  validate(idParamSchema, 'params'),
  validate(updateProductSchema),
  asyncHandler(adminController.updateProduct)
);
router.delete(
  '/products/:id',
  validate(idParamSchema, 'params'),
  asyncHandler(adminController.deleteProduct)
);

router.get('/categories', asyncHandler(adminController.listCategories));
router.post('/categories', validate(createCategorySchema), asyncHandler(adminController.createCategory));
router.patch(
  '/categories/:id',
  validate(idParamSchema, 'params'),
  validate(updateCategorySchema),
  asyncHandler(adminController.updateCategory)
);
router.delete(
  '/categories/:id',
  validate(idParamSchema, 'params'),
  asyncHandler(adminController.deleteCategory)
);

router.get('/orders', validate(listOrdersSchema, 'query'), asyncHandler(adminController.listOrders));
router.get('/orders/:id', validate(idParamSchema, 'params'), asyncHandler(adminController.getOrder));
router.patch(
  '/orders/:id/status',
  validate(idParamSchema, 'params'),
  validate(updateOrderStatusSchema),
  asyncHandler(adminController.updateOrderStatus)
);

router.get('/users', asyncHandler(adminController.listUsers));

export default router;
