import Product from '../models/Product.js';
import { createError } from '../middleware/errorHandler.js';

const normalizeStringValue = (value) => {
  if (value === undefined || value === null) return value;
  if (typeof value === 'string') return value.trim();
  if (typeof value === 'object') {
    return value.name?.trim() || value.value?.trim() || value.label?.trim() || '';
  }
  return String(value).trim();
};

const normalizeArrayValue = (value) => {
  if (Array.isArray(value)) return value;
  if (typeof value === 'string' && value.trim()) return value.split(',').map((item) => item.trim()).filter(Boolean);
  return [];
};

const normalizeImageValue = (image, productName) => {
  if (typeof image === 'string') {
    const trimmed = image.trim();
    if (!trimmed) return null;

    const [colorPart, urlPart] = trimmed.split('|').map((item) => item.trim());
    if (urlPart) {
      return {
        url: urlPart,
        altText: `${productName} ${colorPart}`.trim(),
        color: colorPart || undefined
      };
    }

    return { url: trimmed, altText: productName };
  }

  if (image && typeof image === 'object') {
    const url = normalizeStringValue(image.url);
    if (!url) return null;

    const color = normalizeStringValue(image.color);
    return {
      url,
      altText: normalizeStringValue(image.altText) || [productName, color].filter(Boolean).join(' '),
      ...(color ? { color } : {})
    };
  }

  return null;
};

const normalizeProductPayload = (payload) => ({
  ...payload,
  name: normalizeStringValue(payload.name),
  description: normalizeStringValue(payload.description),
  brand: normalizeStringValue(payload.brand),
  category: normalizeStringValue(payload.category),
  collection: normalizeStringValue(payload.collection) || 'New Arrivals',
  gender: normalizeStringValue(payload.gender),
  sizes: normalizeArrayValue(payload.sizes).map((size) => Number(size)).filter((size) => !Number.isNaN(size)),
  colors: normalizeArrayValue(payload.colors).map((color) => normalizeStringValue(color)).filter(Boolean),
  images: (Array.isArray(payload.images) ? payload.images : typeof payload.images === 'string' ? [payload.images] : [])
    .map((image) => normalizeImageValue(image, normalizeStringValue(payload.name)))
    .filter(Boolean),
  price: Number(payload.price),
  discount: Number(payload.discount || 0),
  stock: Number(payload.stock || 0),
  rating: payload.rating !== undefined ? Number(payload.rating) : undefined,
  soldCount: payload.soldCount !== undefined ? Number(payload.soldCount) : undefined,
  isActive: payload.isActive !== undefined ? payload.isActive === true || payload.isActive === 'true' : true
});

const buildQuery = (query) => {
  const filter = { isActive: true };

  if (query.search) {
    filter.$or = [
      { name: { $regex: query.search, $options: 'i' } },
      { brand: { $regex: query.search, $options: 'i' } },
      { description: { $regex: query.search, $options: 'i' } }
    ];
  }

  if (query.category) filter.category = query.category;
  if (query.brand) filter.brand = query.brand;
  if (query.gender) filter.gender = query.gender;
  if (query.collection) filter.collection = query.collection;
  if (query.color) filter.colors = query.color;
  if (query.size) filter.sizes = Number(query.size);
  if (query.minPrice || query.maxPrice) {
    filter.finalPrice = {};
    if (query.minPrice) filter.finalPrice.$gte = Number(query.minPrice);
    if (query.maxPrice) filter.finalPrice.$lte = Number(query.maxPrice);
  }
  if (query.rating) filter.rating = { $gte: Number(query.rating) };

  return filter;
};

export const getProducts = async (req, res, next) => {
  try {
    const page = Number(req.query.page || 1);
    const limit = Number(req.query.limit || 12);
    const skip = (page - 1) * limit;
    const sortBy = req.query.sortBy || 'createdAt';
    const sortOrder = req.query.sortOrder === 'asc' ? 1 : -1;

    const filter = buildQuery(req.query);

    const [products, total] = await Promise.all([
      Product.find(filter)
        .sort({ [sortBy]: sortOrder })
        .skip(skip)
        .limit(limit),
      Product.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      products,
      pagination: {
        total,
        page,
        limit,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) throw createError('Product not found', 404);

    res.status(200).json({ success: true, product });
  } catch (error) {
    next(error);
  }
};

export const createProduct = async (req, res, next) => {
  try {
    const product = await Product.create(normalizeProductPayload(req.body));
    res.status(201).json({ success: true, message: 'Product created successfully', product });
  } catch (error) {
    next(error);
  }
};

export const updateProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(req.params.id, normalizeProductPayload(req.body), {
      new: true,
      runValidators: true
    });
    if (!product) throw createError('Product not found', 404);

    res.status(200).json({ success: true, message: 'Product updated successfully', product });
  } catch (error) {
    next(error);
  }
};

export const deleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id);
    if (!product) throw createError('Product not found', 404);

    res.status(200).json({ success: true, message: 'Product deleted successfully' });
  } catch (error) {
    next(error);
  }
};

export const softDeleteProduct = async (req, res, next) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      { isActive: false },
      { new: true }
    );
    if (!product) throw createError('Product not found', 404);

    res.status(200).json({ success: true, message: 'Product hidden from catalog', product });
  } catch (error) {
    next(error);
  }
};

export const getFeaturedProducts = async (req, res, next) => {
  try {
    const products = await Product.find({ isActive: true })
      .sort({ rating: -1, soldCount: -1 })
      .limit(8);

    res.status(200).json({ success: true, products });
  } catch (error) {
    next(error);
  }
};

export default {
  getProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  softDeleteProduct,
  getFeaturedProducts
};
