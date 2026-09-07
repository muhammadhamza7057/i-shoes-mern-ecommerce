import asyncHandler from '../../utils/asyncHandler.js';
import validate from '../../middleware/validate.js';
import { sendSuccess } from '../../utils/response.js';
import { parsePagination, buildPaginationMeta } from '../../utils/helpers.js';
import { listCategoriesSchema, categoryIdSchema } from './categories.validation.js';
import * as categoriesService from './categories.service.js';

const attachPagination = (req, res, next) => {
  req.pagination = parsePagination(req.query, 20, 100);
  next();
};

export const list = asyncHandler(async (req, res) => {
  await categoriesService.listCategories(req, res);
});

export const getById = asyncHandler(async (req, res) => {
  await categoriesService.getCategoryById(req, res);
});

export default { list, getById };
