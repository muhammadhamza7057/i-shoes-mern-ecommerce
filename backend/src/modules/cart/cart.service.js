import ApiError from '../../utils/ApiError.js';
import { carts as Cart, products as Product, variants as Variant } from '../../repositories/index.js';
import { findVariant, getVariantPrice, serializeProduct } from '../products/product.serializer.js';
import { assertVariantAvailable } from '../inventory/inventory.service.js';

const getOrCreateCart = (userId) => Cart.getOrCreate(userId);

const serializeCartItem = async (item) => {
  const product = await Product.findById(item.product);
  const variant = await Variant.find(item.variantId);
  return {
    _id: item._id,
    cartId: `${item.product}-${variant.size}-${variant.color}`,
    productId: item.product,
    quantity: item.quantity,
    priceSnapshot: item.priceSnapshot,
    selectedSize: variant.size,
    selectedColor: variant.color,
    sku: variant.sku,
    ...(product ? serializeProduct(product) : {}),
    price: item.priceSnapshot,
    finalPrice: item.priceSnapshot,
  };
};

export const getCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  const items = await Promise.all(cart.items.map(serializeCartItem));
  const totalPrice = items.reduce((s, i) => s + i.priceSnapshot * i.quantity, 0);
  const itemCount = items.reduce((s, i) => s + i.quantity, 0);

  return { items, totalPrice, itemCount };
};

export const addItem = async (userId, body) => {
  const product = await Product.findById(body.productId);
  if (!product || product.status !== 'active') {
    throw ApiError.notFound('Product not found');
  }

  const variant = await assertVariantAvailable(
    product,
    { sku: body.sku, size: body.size, color: body.color },
    body.quantity
  );

  if (!variant?._id) {
    throw ApiError.badRequest('Product variant is unavailable');
  }

  const priceSnapshot = getVariantPrice(product, variant);
  const cart = await getOrCreateCart(userId);

  const existing = cart.items.find((i) => String(i.variantId) === String(variant._id));

  if (existing) {
    const newQty = existing.quantity + body.quantity;
    await assertVariantAvailable(product, { sku: variant.sku }, newQty);
    await Cart.updateItem(existing._id, newQty);
  } else {
    await Cart.upsertItem(cart.id, variant._id, body.quantity, priceSnapshot);
  }
  return getCart(userId);
};

export const updateItem = async (userId, itemId, quantity) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((candidate) => String(candidate._id) === String(itemId));
  if (!item) throw ApiError.notFound('Cart item not found');

  const product = await Product.findById(item.product);
  if (!product) throw ApiError.notFound('Product not found');

  await assertVariantAvailable(product, { sku: (await Variant.find(item.variantId)).sku }, quantity);
  await Cart.updateItem(itemId, quantity);

  return getCart(userId);
};

export const removeItem = async (userId, itemId) => {
  const cart = await getOrCreateCart(userId);
  const item = cart.items.find((candidate) => String(candidate._id) === String(itemId));
  if (!item) throw ApiError.notFound('Cart item not found');

  await Cart.removeItem(itemId);
  return getCart(userId);
};

export const clearCart = async (userId) => {
  const cart = await getOrCreateCart(userId);
  await Cart.clear(cart.id);
  return getCart(userId);
};

export default { getCart, addItem, updateItem, removeItem, clearCart };
