import { z } from 'zod';
import { parsePagination } from '../../utils/helpers.js';

export const listCategoriesSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  parent: z.string().optional(),
});

export const categoryIdSchema = z.object({
  id: z.string().min(1),
});

export const createCategorySchema = z.object({
  name: z.string().trim().min(1),
  parent: z.string().optional().nullable(),
  isActive: z.boolean().optional(),
});

export const updateCategorySchema = createCategorySchema.partial();

export const parseCategoryList = (query) => parsePagination(query, 20, 100);

export default {
  listCategoriesSchema,
  categoryIdSchema,
  createCategorySchema,
  updateCategorySchema,
};
