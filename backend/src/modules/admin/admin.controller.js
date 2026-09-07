import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as adminService from './admin.service.js';

export const dashboard = asyncHandler(async (req, res) => {
  const data = await adminService.getDashboard();
  sendSuccess(res, data);
});

export const listProducts = asyncHandler(async (req, res) => {
  const data = await adminService.adminListProducts(req.query);
  sendSuccess(res, data);
});

export const createProduct = asyncHandler(async (req, res) => {
  const data = await adminService.adminCreateProduct(req.body);
  sendSuccess(res, data, 'Product created', 201);
});

export const updateProduct = asyncHandler(async (req, res) => {
  const data = await adminService.adminUpdateProduct(req.params.id, req.body);
  sendSuccess(res, data, 'Product updated');
});

export const deleteProduct = asyncHandler(async (req, res) => {
  const data = await adminService.adminDeleteProduct(req.params.id);
  sendSuccess(res, data, 'Product deleted');
});

export const listCategories = asyncHandler(async (req, res) => {
  const data = await adminService.adminListCategories(req.query);
  sendSuccess(res, data);
});

export const createCategory = asyncHandler(async (req, res) => {
  const data = await adminService.adminCreateCategory(req.body);
  sendSuccess(res, data, 'Category created', 201);
});

export const updateCategory = asyncHandler(async (req, res) => {
  const data = await adminService.adminUpdateCategory(req.params.id, req.body);
  sendSuccess(res, data, 'Category updated');
});

export const deleteCategory = asyncHandler(async (req, res) => {
  const data = await adminService.adminDeleteCategory(req.params.id);
  sendSuccess(res, data, 'Category deleted');
});

export const listOrders = asyncHandler(async (req, res) => {
  const data = await adminService.adminListOrders(req.query);
  sendSuccess(res, data);
});

export const getOrder = asyncHandler(async (req, res) => {
  const data = await adminService.adminGetOrder(req.params.id);
  sendSuccess(res, data);
});

export const updateOrderStatus = asyncHandler(async (req, res) => {
  const data = await adminService.adminUpdateOrderStatus(req.params.id, req.body.status);
  sendSuccess(res, data, 'Order status updated');
});

export const listUsers = asyncHandler(async (req, res) => {
  const data = await adminService.adminListUsers(req.query);
  sendSuccess(res, data);
});

export default {
  dashboard,
  listProducts,
  createProduct,
  updateProduct,
  deleteProduct,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  listOrders,
  getOrder,
  updateOrderStatus,
  listUsers,
};
