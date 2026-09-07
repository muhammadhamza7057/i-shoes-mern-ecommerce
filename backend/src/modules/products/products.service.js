import ApiError from '../../utils/ApiError.js';
import { slugify, buildPaginationMeta } from '../../utils/helpers.js';
import { products as Product, categories as Category } from '../../repositories/index.js';
import { serializeProduct } from './product.serializer.js';

const buildVariantSku = (productSlug, size, color, index) =>
  `${productSlug}-${String(size).replace(/\s+/g, '')}-${String(color).replace(/\s+/g, '')}-${index + 1}`.toUpperCase();

const createUniqueSlug = async (name) => {
  const baseSlug = slugify(name);
  let slug = baseSlug;
  let suffix = 2;

  while (await Product.findBySlug(slug)) {
    slug = `${baseSlug}-${suffix}`;
    suffix += 1;
  }

  return slug;
};

export const buildProductFilter = (query, { publicOnly = true } = {}) => ({ query, publicOnly });

export const listProducts = async ({ query, pagination, publicOnly = true }) => {
  const { page, limit, skip } = pagination;
  const result = await Product.list({ query, publicOnly, offset: skip, limit });

  return {
    products: result.items.map(serializeProduct),
    pagination: buildPaginationMeta(result.total, page, limit),
  };
};

export const getProductById = async (id, { publicOnly = true } = {}) => {
  const isUuid = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(id);
  const product = isUuid
    ? await Product.findById(id, { publicOnly })
    : await Product.findBySlug(id);
  if (!product) throw ApiError.notFound('Product not found');
  if (publicOnly && product.status !== 'active') throw ApiError.notFound('Product not found');
  return serializeProduct(product);
};

export const getFeaturedProducts = async (limit = 8) => {
  const result = await Product.list({ query: { featured: true }, publicOnly: true, limit });

  return result.items.map(serializeProduct);
};

export const normalizeVariants = (slug, variants, basePrice, salePrice) =>
  variants.map((v, index) => ({
    size: String(v.size),
    color: v.color,
    sku: v.sku || buildVariantSku(slug, v.size, v.color, index),
    price: v.price ?? salePrice ?? basePrice,
    stock: v.stock ?? 0,
    reservedStock: 0,
    soldStock: 0,
  }));

const buildLegacyVariants = (body, basePrice, salePrice) => {
  if (body.variants?.length) return body.variants;

  const sizes = Array.isArray(body.sizes) ? body.sizes : [];
  const colors = Array.isArray(body.colors) ? body.colors : [];
  const stock = Number(body.stock || 0);
  return sizes.flatMap((size) => colors.map((color) => ({
    size: String(size),
    color,
    price: salePrice ?? basePrice,
    stock,
  })));
};

const resolveCategory = async (value) => {
  const byId = await Category.findById(value).catch(() => null);
  if (byId) return byId;
  return Category.findByName(value);
};

export const createProduct = async (body) => {
  const basePrice = body.basePrice ?? body.price;
  const salePrice = body.salePrice ?? (
    body.discount != null ? Number((basePrice * (1 - Number(body.discount) / 100)).toFixed(2)) : null
  );
  const category = await resolveCategory(body.category);
  if (!category || !category.isActive) {
    throw ApiError.badRequest('Invalid category');
  }

  const slug = await createUniqueSlug(body.name);

  const variants = normalizeVariants(
    slug,
    buildLegacyVariants(body, basePrice, salePrice),
    basePrice,
    salePrice
  );
  const thumbnail = body.thumbnail || body.images?.[0]?.url || '';

  const product = await Product.create({
    name: body.name,
    slug,
    description: body.description || '',
    brand: body.brand || 'I.Shoes',
    category: category._id,
    images: body.images || [],
    thumbnail,
    basePrice,
    salePrice,
    variants,
    featured: body.featured ?? false,
    status: body.status || 'draft',
    tags: body.tags || [],
  });

  return serializeProduct(product);
};

export const updateProduct = async (id, body) => {
  const product = await Product.findById(id);
  if (!product) throw ApiError.notFound('Product not found');

  if (body.category && !(await resolveCategory(body.category))) throw ApiError.badRequest('Invalid category');
  const slug = body.name ? slugify(body.name) : product.slug;
  const basePrice = body.basePrice ?? body.price ?? product.basePrice;
  const salePrice = body.salePrice ?? (
    body.discount != null ? Number((basePrice * (1 - Number(body.discount) / 100)).toFixed(2)) : product.salePrice
  );
  const category = body.category ? await resolveCategory(body.category) : null;
  const input = { ...body, slug, category: category?._id || body.category, basePrice, salePrice };
  if (body.variants || body.sizes || body.colors) {
    input.variants = normalizeVariants(slug, buildLegacyVariants(body, basePrice, salePrice), basePrice, salePrice);
  }
  return serializeProduct(await Product.update(id, input));
};

export const deleteProduct = async (id) => {
  if (!(await Product.findById(id))) throw ApiError.notFound('Product not found');
  return serializeProduct(await Product.update(id, { status: 'inactive' }));
};

export default {
  listProducts,
  getProductById,
  getFeaturedProducts,
  createProduct,
  updateProduct,
  deleteProduct,
};
