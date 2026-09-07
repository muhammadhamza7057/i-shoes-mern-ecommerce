import ApiError from '../../utils/ApiError.js';
import { buildPaginationMeta } from '../../utils/helpers.js';
import { orders as Order, products as Product, carts as Cart, variants as Variant } from '../../repositories/index.js';
import { findVariant, getVariantPrice } from '../products/product.serializer.js';
import {
  assertVariantAvailable,
  reserveStock,
  releaseReservedStock,
  finalizeSale,
  withTransaction,
} from '../inventory/inventory.service.js';
import { clearCart } from '../cart/cart.service.js';
import { serializeOrder } from './order.serializer.js';

const SHIPPING_THRESHOLD = 100;
const SHIPPING_FLAT = 10;

const calcShipping = (subtotal) => (subtotal > SHIPPING_THRESHOLD ? 0 : SHIPPING_FLAT);

const buildOrderItemsFromPayload = async (items) => {
  const built = [];

  for (const item of items) {
    const product = await Product.findById(item.productId);
    if (!product || product.status !== 'active') {
      throw ApiError.badRequest(`Product unavailable: ${item.productId}`);
    }

    const variant = await assertVariantAvailable(
      product,
      { sku: item.sku, size: item.size, color: item.color },
      item.quantity
    );

    built.push({
      product: product._id,
      variant: {
        size: variant.size,
        color: variant.color,
        sku: variant.sku,
        variantId: variant._id,
      },
      quantity: item.quantity,
      priceAtPurchase: getVariantPrice(product, variant),
      productName: product.name,
      image: product.thumbnail || product.images?.[0]?.url || '',
    });
  }

  return built;
};

const buildOrderItemsFromCart = async (userId) => {
  const cart = await Cart.getOrCreate(userId);
  if (!cart?.items?.length) {
    throw ApiError.badRequest('Cart is empty');
  }

  const built = [];
  for (const item of cart.items) {
    const product = await Product.findById(item.product);
    if (!product || product.status !== 'active') {
      throw ApiError.badRequest(`Product unavailable: ${item.product}`);
    }

    const variant = await Variant.find(item.variantId);
    if (!variant) throw ApiError.badRequest('Variant unavailable');
    await assertVariantAvailable(product, { sku: variant.sku }, item.quantity);

    built.push({
      product: item.product,
      variant: { size: variant.size, color: variant.color, sku: variant.sku, variantId: variant._id },
      quantity: item.quantity,
      priceAtPurchase: item.priceSnapshot,
      productName: product.name,
      image: product.thumbnail || product.images?.[0]?.url || '',
    });
  }

  return built;
};

export const createOrder = async (userId, body) => {
  const useCart = body.useCart !== false && !body.items?.length;
  const orderItems = useCart
    ? await buildOrderItemsFromCart(userId)
    : await buildOrderItemsFromPayload(body.items);

  const subtotal = orderItems.reduce(
    (sum, item) => sum + item.priceAtPurchase * item.quantity,
    0
  );
  const shipping = calcShipping(subtotal);
  const total = subtotal + shipping;

  const order = await withTransaction(async (session) => {
    await reserveStock(session, orderItems);
    return Order.create({ user: userId, items: orderItems, shippingAddress: body.shippingAddress, subtotal, total, status: 'pending', paymentMethod: body.paymentMethod || 'COD', paymentStatus: 'pending' });
  });

  if (useCart) {
    await clearCart(userId);
  }

  return serializeOrder(order);
};

export const listMyOrders = async (userId, pagination, status) => {
  const { page, limit, skip } = pagination;
  const orders = await Order.list({ user: userId, status, offset: skip, limit });

  return {
    orders: orders.items.map(serializeOrder),
    pagination: buildPaginationMeta(orders.total, page, limit),
  };
};

export const getOrderById = async (userId, orderId, { admin = false } = {}) => {
  const order = await Order.findById(orderId, { user: userId, admin });
  if (!order) throw ApiError.notFound('Order not found');
  return serializeOrder(order);
};

const CANCELLABLE = new Set(['pending', 'confirmed', 'processing']);

export const cancelOrder = async (userId, orderId, cancelReason = '', { admin = false } = {}) => {
  const filter = admin ? { _id: orderId } : { _id: orderId, user: userId };

  return withTransaction(async (session) => {
    const order = await Order.findById(orderId, { user: userId, admin });
    if (!order) throw ApiError.notFound('Order not found');

    if (!CANCELLABLE.has(order.status)) {
      throw ApiError.badRequest(`Order cannot be cancelled in status: ${order.status}`);
    }

    await releaseReservedStock(session, order.items);

    return serializeOrder(await Order.update(orderId, { status: 'cancelled', cancelReason: cancelReason || 'Cancelled by user' }));
  });
};

const STATUS_FLOW = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['processing', 'cancelled'],
  processing: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export const updateOrderStatus = async (orderId, nextStatus) => {
  return withTransaction(async (session) => {
    const order = await Order.findById(orderId, { admin: true });
    if (!order) throw ApiError.notFound('Order not found');

    const allowed = STATUS_FLOW[order.status] || [];
    if (!allowed.includes(nextStatus)) {
      throw ApiError.badRequest(`Cannot transition from ${order.status} to ${nextStatus}`);
    }

    if (nextStatus === 'cancelled') {
      await releaseReservedStock(session, order.items);
    } else if (nextStatus === 'delivered') {
      await finalizeSale(session, order.items);
      return serializeOrder(await Order.update(orderId, { status: 'delivered', paymentStatus: 'paid' }));
    } else {
      return serializeOrder(await Order.update(orderId, { status: nextStatus }));
    }

  });
};

export default {
  createOrder,
  listMyOrders,
  getOrderById,
  cancelOrder,
  updateOrderStatus,
};
