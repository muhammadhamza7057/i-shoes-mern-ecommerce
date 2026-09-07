import { z } from 'zod';
import { createProductSchema, updateProductSchema, listProductsSchema } from '../products/products.validation.js';
import { createCategorySchema, updateCategorySchema } from '../categories/categories.validation.js';
import { listOrdersSchema } from '../orders/orders.validation.js';

export const updateOrderStatusSchema = z.object({
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']),
});

export const idParamSchema = z.object({
  id: z.string().min(1),
});

export {
  createProductSchema,
  updateProductSchema,
  listProductsSchema,
  createCategorySchema,
  updateCategorySchema,
  listOrdersSchema,
};

export default {
  updateOrderStatusSchema,
  idParamSchema,
};
