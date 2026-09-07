import { z } from 'zod';

export const addCartItemSchema = z.object({
  productId: z.string().min(1),
  quantity: z.coerce.number().int().min(1).default(1),
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  sku: z.string().trim().optional(),
});

export const updateCartItemSchema = z.object({
  quantity: z.coerce.number().int().min(1),
});

export const cartItemIdSchema = z.object({
  itemId: z.string().min(1),
});

export default { addCartItemSchema, updateCartItemSchema, cartItemIdSchema };
