import { Router } from 'express';
import validate from '../../middleware/validate.js';
import { parsePagination } from '../../utils/helpers.js';
import { listProductsSchema, productIdSchema } from './products.validation.js';
import * as productsController from './products.controller.js';

const router = Router();

router.get(
  '/featured',
  async (req, res, next) => productsController.featured(req, res, next)
);

router.get(
  '/',
  validate(listProductsSchema, 'query'),
  (req, res, next) => {
    req.pagination = parsePagination(req.query, 12, 100);
    next();
  },
  productsController.list
);

router.get(
  '/:id',
  validate(productIdSchema, 'params'),
  productsController.getById
);

export default router;
