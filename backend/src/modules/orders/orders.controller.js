import asyncHandler from '../../utils/asyncHandler.js';
import { sendSuccess } from '../../utils/response.js';
import * as ordersService from './orders.service.js';

export const create = asyncHandler(async (req, res) => {
  const order = await ordersService.createOrder(req.user._id, req.body);
  sendSuccess(res, { order }, 'Order placed successfully', 201);
});

export const listMine = asyncHandler(async (req, res) => {
  const result = await ordersService.listMyOrders(
    req.user._id,
    req.pagination,
    req.query.status
  );
  sendSuccess(res, result);
});

export const getById = asyncHandler(async (req, res) => {
  const order = await ordersService.getOrderById(req.user._id, req.params.id);
  sendSuccess(res, { order });
});

export const cancel = asyncHandler(async (req, res) => {
  const order = await ordersService.cancelOrder(
    req.user._id,
    req.params.id,
    req.body.cancelReason
  );
  sendSuccess(res, { order }, 'Order cancelled');
});

export default { create, listMine, getById, cancel };
