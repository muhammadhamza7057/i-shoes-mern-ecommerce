import ApiError from '../../utils/ApiError.js';
import { variants as Variant } from '../../repositories/index.js';
import { findVariant } from '../products/product.serializer.js';

export const getAvailableUnits = (variant) =>
  Math.max(0, (variant.stock || 0) - (variant.reservedStock || 0));

export const assertVariantAvailable = async (product, variantSelector, quantity) => {
  const variant = findVariant(product, variantSelector) || await Variant.findForProduct(product._id, variantSelector);
  if (!variant) {
    throw ApiError.badRequest('Variant not found for product', {
      productId: product._id,
      ...variantSelector,
    });
  }

  const available = getAvailableUnits(variant);
  if (quantity > available) {
    throw ApiError.badRequest(
      `Insufficient stock for ${product.name} (${variant.size}/${variant.color}). Available: ${available}`
    );
  }

  return variant;
};

/**
 * Reserve stock when an order is placed.
 * Must run inside session.withTransaction().
 */
export const reserveStock = async (_session, items) => {
  for (const item of items) {
    await Variant.reserve(item.variant.variantId, item.quantity);
  }
};

/**
 * Release reserved stock when an order is cancelled.
 */
export const releaseReservedStock = async (_session, items) => {
  for (const item of items) {
    await Variant.release(item.variant.variantId, item.quantity);
  }
};

/**
 * Finalize sale on delivery: stock -= qty, reservedStock -= qty, soldStock += qty
 */
export const finalizeSale = async (_session, items) => {
  for (const item of items) {
    await Variant.finalize(item.variant.variantId, item.quantity);
  }
};

export const withTransaction = async (work) => work(null);

export default {
  getAvailableUnits,
  assertVariantAvailable,
  reserveStock,
  releaseReservedStock,
  finalizeSale,
  withTransaction,
};
