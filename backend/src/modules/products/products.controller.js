import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as productsService from './products.service.js';

export const list = asyncHandler(async (req, res) => {
  const result = await productsService.listProducts({
    query: req.query,
    pagination: req.pagination,
    publicOnly: true,
  });
  sendSuccess(res, result);
});

export const featured = asyncHandler(async (req, res) => {
  const limit = Number(req.query.limit) || 8;
  const products = await productsService.getFeaturedProducts(limit);
  sendSuccess(res, { products });
});

export const getById = asyncHandler(async (req, res) => {
  const product = await productsService.getProductById(req.params.id);
  sendSuccess(res, { product });
});

export default { list, featured, getById };
