import { z } from 'zod';

const shippingAddressSchema = z.object({
  firstName: z.string().trim().min(1),
  lastName: z.string().trim().min(1),
  email: z.string().trim().email(),
  phone: z.string().trim().min(7),
  street: z.string().trim().min(1),
  city: z.string().trim().min(1),
  state: z.string().trim().min(1),
  postalCode: z.string().trim().min(1),
  country: z.string().trim().min(1).default('USA'),
});

const orderItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  sku: z.string().trim().optional(),
});

export const createOrderSchema = z.object({
  items: z.array(orderItemSchema).min(1).optional(),
  shippingAddress: shippingAddressSchema,
  paymentMethod: z.preprocess(
    (value) => String(value || 'COD').toUpperCase(),
    z.enum(['COD'])
  ).default('COD'),
  useCart: z.boolean().optional(),
});

export const orderIdSchema = z.object({
  id: z.string().min(1),
});

export const cancelOrderSchema = z.object({
  cancelReason: z.string().trim().optional(),
});

export const listOrdersSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  status: z.enum(['pending', 'confirmed', 'processing', 'shipped', 'delivered', 'cancelled']).optional(),
});

export default { createOrderSchema, orderIdSchema, cancelOrderSchema, listOrdersSchema };
