export const slugify = (text) =>
  String(text)
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');

export const parsePagination = (query, defaultLimit = 12, maxLimit = 100) => {
  const page = Math.max(1, Number(query.page) || 1);
  const limit = Math.min(maxLimit, Math.max(1, Number(query.limit) || defaultLimit));
  const skip = (page - 1) * limit;
  return { page, limit, skip };
};

export const buildPaginationMeta = (total, page, limit) => ({
  total,
  page,
  limit,
  pages: Math.max(1, Math.ceil(total / limit)),
});

export const variantKey = (variant) => {
  if (variant?.sku) return variant.sku;
  return `${variant?.size || ''}:${variant?.color || ''}`.toLowerCase();
};

export default { slugify, parsePagination, buildPaginationMeta, variantKey };
