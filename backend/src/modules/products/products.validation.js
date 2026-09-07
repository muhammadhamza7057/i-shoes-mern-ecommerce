import { z } from 'zod';

const variantInputSchema = z.object({
  size: z.string().trim().min(1),
  color: z.string().trim().min(1),
  sku: z.string().trim().min(1).optional(),
  price: z.coerce.number().min(0).optional(),
  stock: z.coerce.number().int().min(0).default(0),
});

const imageInputSchema = z.object({
  url: z.string().refine((value) => value.startsWith('data:image/') || z.string().url().safeParse(value).success, 'Invalid image URL'),
  altText: z.string().optional(),
  color: z.string().optional(),
});

const optionalQueryNumber = z.preprocess(
  (value) => value === '' ? undefined : value,
  z.coerce.number().optional()
);

export const listProductsSchema = z.object({
  page: z.coerce.number().int().positive().optional(),
  limit: z.coerce.number().int().positive().max(100).optional(),
  search: z.string().optional(),
  category: z.string().optional(),
  brand: z.string().optional(),
  size: z.string().optional(),
  minPrice: optionalQueryNumber,
  maxPrice: optionalQueryNumber,
  rating: optionalQueryNumber,
  sortBy: z.enum(['createdAt', 'basePrice', 'ratingAvg', 'name']).optional(),
  sortOrder: z.enum(['asc', 'desc']).optional(),
  featured: z.coerce.boolean().optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
});

export const productIdSchema = z.object({
  id: z.string().min(1),
});

const productFieldsSchema = z.object({
  name: z.string().trim().min(1),
  description: z.string().optional(),
  brand: z.string().trim().optional(),
  category: z.string().min(1),
  images: z.array(imageInputSchema).optional(),
  thumbnail: z.string().url().optional(),
  basePrice: z.coerce.number().min(0).optional(),
  salePrice: z.coerce.number().min(0).optional().nullable(),
  variants: z.array(variantInputSchema).optional(),
  price: z.coerce.number().min(0).optional(),
  discount: z.coerce.number().min(0).max(100).optional(),
  sizes: z.array(z.union([z.string(), z.number()])).optional(),
  colors: z.array(z.string().trim().min(1)).optional(),
  stock: z.coerce.number().int().min(0).optional(),
  featured: z.boolean().optional(),
  status: z.enum(['draft', 'active', 'inactive']).optional(),
  tags: z.array(z.string()).optional(),
});

export const createProductSchema = productFieldsSchema.refine(
  (product) => product.basePrice != null || product.price != null,
  'A base price is required'
).refine(
  (product) => product.variants?.length > 0 || (product.sizes?.length > 0 && product.colors?.length > 0),
  'At least one product size and color are required'
);

export const updateProductSchema = productFieldsSchema.partial();

export default {
  listProductsSchema,
  productIdSchema,
  createProductSchema,
  updateProductSchema,
};
