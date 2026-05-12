import express from 'express';
import {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  getFeaturedProducts
} from '../controllers/productController.js';
import { authenticate, authorize } from '../middleware/auth.js';
import { productValidationRules, handleValidationErrors } from '../middleware/validation.js';

const router = express.Router();

// Public routes
router.get('/featured', getFeaturedProducts);
router.get('/', getProducts);
router.get('/:id', getProductById);

// Admin-only routes
router.post('/',         authenticate, authorize, productValidationRules(), handleValidationErrors, createProduct);
router.patch('/:id',     authenticate, authorize, updateProduct);
router.patch('/:id/hide', authenticate, authorize, softDeleteProduct);
router.delete('/:id',    authenticate, authorize, deleteProduct);

export default router;
