export const serializeProduct = (product) => {
  const doc = product.toObject ? product.toObject() : product;
  const variants = doc.variants || [];

  const sizes = [...new Set(variants.map((v) => v.size))];
  const colors = [...new Set(variants.map((v) => v.color))];
  const totalStock = variants.reduce((s, v) => s + (v.stock || 0), 0);
  const availableStock = variants.reduce(
    (s, v) => s + Math.max(0, (v.stock || 0) - (v.reservedStock || 0)),
    0
  );

  const effectivePrice = doc.salePrice ?? doc.basePrice;

  return {
    ...doc,
    price: doc.basePrice,
    finalPrice: effectivePrice,
    discount:
      doc.salePrice != null && doc.basePrice > 0
        ? Math.round(((doc.basePrice - doc.salePrice) / doc.basePrice) * 100)
        : 0,
    stock: availableStock,
    totalStock,
    sizes,
    colors,
    rating: doc.ratingAvg ?? 0,
    isActive: doc.status === 'active',
    category: doc.category?.name || doc.category,
    categoryId: doc.category?._id || doc.category,
  };
};

export const findVariant = (product, { sku, size, color }) => {
  if (!product?.variants?.length) return null;

  if (sku) {
    return product.variants.find((v) => v.sku === sku) || null;
  }

  if (size && color) {
    return (
      product.variants.find(
        (v) =>
          String(v.size).toLowerCase() === String(size).toLowerCase() &&
          String(v.color).toLowerCase() === String(color).toLowerCase()
      ) || null
    );
  }

  return null;
};

export const getVariantPrice = (product, variant) =>
  variant?.price ?? product.salePrice ?? product.basePrice;

export default { serializeProduct, findVariant, getVariantPrice };
