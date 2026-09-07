import { Router } from 'express';
import validate from '../../middleware/validate.js';
import { listCategoriesSchema, categoryIdSchema } from './categories.validation.js';
import * as categoriesController from './categories.controller.js';
import { parsePagination } from '../../utils/helpers.js';

const router = Router();

router.get(
  '/',
  validate(listCategoriesSchema, 'query'),
  (req, res, next) => {
    req.pagination = parsePagination(req.query, 20, 100);
    next();
  },
  categoriesController.list
);

router.get(
  '/:id',
  validate(categoryIdSchema, 'params'),
  categoriesController.getById
);

export default router;
