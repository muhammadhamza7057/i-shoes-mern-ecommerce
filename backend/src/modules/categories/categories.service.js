import ApiError from '../../utils/ApiError.js';
import { sendSuccess, sendPaginated } from '../../utils/response.js';
import { slugify, buildPaginationMeta } from '../../utils/helpers.js';
import { categories as Category } from '../../repositories/index.js';

export const listCategories = async (req, res) => {
  const { page, limit, skip } = req.pagination;
  const filter = { isActive: true };

  if (req.query.parent) {
    filter.parent = req.query.parent === 'null' ? null : req.query.parent;
  }

  const result = await Category.list({ active: true, parent: filter.parent, offset: skip, limit });
  const { items, total } = result;

  sendPaginated(res, items, buildPaginationMeta(total, page, limit));
};

export const getCategoryById = async (req, res) => {
  const category = await Category.findById(req.params.id);
  if (!category || !category.isActive) throw ApiError.notFound('Category not found');
  sendSuccess(res, { category });
};

export const createCategory = async (body) => {
  const slug = slugify(body.name);
  const existing = await Category.findBySlug(slug);
  if (existing) throw ApiError.conflict('Category slug already exists');

  return Category.create({
    name: body.name,
    slug,
    parent: body.parent || null,
    isActive: body.isActive ?? true,
  });
};

export const updateCategory = async (id, body) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');

  return Category.update(id, {
    name: body.name,
    slug: body.name ? slugify(body.name) : undefined,
    parent: body.parent,
    isActive: body.isActive,
  });
};

export const deleteCategory = async (id) => {
  const category = await Category.findById(id);
  if (!category) throw ApiError.notFound('Category not found');
  return Category.update(id, { isActive: false });
};

export default {
  listCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
};
