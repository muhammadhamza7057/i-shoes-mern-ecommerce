import Order from '../models/Order.js';
import Product from '../models/Product.js';
import Cart from '../models/Cart.js';
import { createError } from '../middleware/errorHandler.js';

/**
 * Valid order statuses — must match the Order model enum exactly.
 */
const VALID_ORDER_STATUSES = [
  'pending',
  'processing',
  'ready_for_delivery',
  'shipped',
  'delivered',
  'cancelled'
];

/* ─── Place order ────────────────────────────────────────────────────────── */
export const placeOrder = async (req, res, next) => {
  try {
    const {
      items,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes,
      shippingCost = 0,
      discount = 0
    } = req.body;

    if (!items || !items.length) {
      throw createError('Order must contain at least one item', 400);
    }

    // Enrich items from DB — validates stock and captures product snapshot
    const enrichedItems = [];
    for (const item of items) {
      if (!item.productId) throw createError('Each item must have a productId', 400);
      if (!item.quantity || item.quantity < 1) {
        throw createError('Each item must have a valid quantity (≥ 1)', 400);
      }

      const product = await Product.findById(item.productId);
      if (!product) throw createError(`Product not found: ${item.productId}`, 404);
      if (!product.isActive) throw createError(`Product is no longer available: ${product.name}`, 400);
      if (product.stock < item.quantity) {
        throw createError(
          `Insufficient stock for "${product.name}". Available: ${product.stock}, requested: ${item.quantity}`,
          400
        );
      }

      enrichedItems.push({
        productId:   product._id,
        productName: product.name,
        quantity:    item.quantity,
        price:       item.price || product.finalPrice || product.price,
        discount:    product.discount || 0,
        size:        item.size  || '',
        color:       item.color || '',
        image:       product.images?.[0]?.url || ''
      });
    }

    // Create order with initial status history entry
    const order = await Order.create({
      userId: req.user.id,
      items:  enrichedItems,
      shippingAddress,
      billingAddress,
      paymentMethod,
      notes:        notes || '',
      shippingCost: Number(shippingCost) || 0,
      discount:     Number(discount)     || 0,
      paymentStatus: 'pending',
      orderStatus:   'pending',
      statusHistory: [
        {
          status:    'pending',
          note:      'Order placed successfully',
          updatedBy: 'system',
          changedAt: new Date()
        }
      ]
    });

    // Decrement stock + increment soldCount atomically
    for (const item of enrichedItems) {
      await Product.findByIdAndUpdate(item.productId, {
        $inc: { stock: -item.quantity, soldCount: item.quantity }
      });
    }

    // Clear the user's server-side cart
    await Cart.findOneAndUpdate(
      { userId: req.user.id },
      { items: [], subtotal: 0, totalItems: 0 },
      { upsert: true }
    );

    res.status(201).json({
      success: true,
      message: 'Order placed successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Get my orders (user) ───────────────────────────────────────────────── */
export const getMyOrders = async (req, res, next) => {
  try {
    const orders = await Order.find({ userId: req.user.id })
      .sort({ createdAt: -1 })
      .populate('items.productId', 'name images price');

    res.status(200).json({ success: true, orders });
  } catch (error) {
    next(error);
  }
};

/* ─── Get all orders (admin) ─────────────────────────────────────────────── */
export const getAllOrders = async (req, res, next) => {
  try {
    const {
      status,
      paymentStatus,
      search,
      page  = 1,
      limit = 100
    } = req.query;

    const filter = {};
    if (status)        filter.orderStatus   = status;
    if (paymentStatus) filter.paymentStatus = paymentStatus;

    // Search by order ID suffix, customer email, or customer name
    if (search) {
      const regex = { $regex: search, $options: 'i' };
      filter.$or = [
        { 'shippingAddress.firstName': regex },
        { 'shippingAddress.lastName':  regex },
        { 'shippingAddress.email':     regex }
      ];
    }

    const skip = (Number(page) - 1) * Number(limit);

    const [orders, total] = await Promise.all([
      Order.find(filter)
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(Number(limit))
        .populate('userId',          'email firstName lastName phone')
        .populate('items.productId', 'name images price'),
      Order.countDocuments(filter)
    ]);

    res.status(200).json({
      success: true,
      orders,
      pagination: {
        total,
        page:  Number(page),
        limit: Number(limit),
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Get single order ───────────────────────────────────────────────────── */
export const getOrderById = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id)
      .populate('userId',          'email firstName lastName phone')
      .populate('items.productId', 'name images price');

    if (!order) throw createError('Order not found', 404);

    // Only the owner or an admin can view
    const isOwner = order.userId?._id?.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) throw createError('Access denied', 403);

    res.status(200).json({ success: true, order });
  } catch (error) {
    next(error);
  }
};

/* ─── Update order status (admin) ────────────────────────────────────────── */
export const updateOrderStatus = async (req, res, next) => {
  try {
    const { status, paymentStatus, note } = req.body;

    // Validate status value
    if (status && !VALID_ORDER_STATUSES.includes(status)) {
      throw createError(
        `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`,
        400
      );
    }

    const order = await Order.findById(req.params.id);
    if (!order) throw createError('Order not found', 404);

    // Build update object
    const updates = {};
    if (status) {
      updates.orderStatus = status;
      if (status === 'delivered') updates.deliveredAt = new Date();
      if (status === 'cancelled') updates.cancelledAt = new Date();
    }
    if (paymentStatus) updates.paymentStatus = paymentStatus;

    // Push to statusHistory
    if (status) {
      updates.$push = {
        statusHistory: {
          status,
          note:      note || `Status updated to ${status}`,
          updatedBy: 'admin',
          changedAt: new Date()
        }
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('userId',          'email firstName lastName phone')
      .populate('items.productId', 'name images price');

    res.status(200).json({
      success: true,
      message: `Order status updated to "${status || order.orderStatus}"`,
      order:   updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Full order update (admin) ──────────────────────────────────────────── */
export const updateOrder = async (req, res, next) => {
  try {
    const {
      orderStatus,
      paymentStatus,
      notes,
      shippingAddress,
      billingAddress,
      note
    } = req.body;

    if (orderStatus && !VALID_ORDER_STATUSES.includes(orderStatus)) {
      throw createError(
        `Invalid status. Must be one of: ${VALID_ORDER_STATUSES.join(', ')}`,
        400
      );
    }

    const order = await Order.findById(req.params.id);
    if (!order) throw createError('Order not found', 404);

    const updates = {
      ...(orderStatus     && { orderStatus }),
      ...(paymentStatus   && { paymentStatus }),
      ...(notes !== undefined && { notes }),
      ...(shippingAddress && { shippingAddress }),
      ...(billingAddress  && { billingAddress }),
      ...(orderStatus === 'delivered' && { deliveredAt: new Date() }),
      ...(orderStatus === 'cancelled' && { cancelledAt: new Date() })
    };

    if (orderStatus) {
      updates.$push = {
        statusHistory: {
          status:    orderStatus,
          note:      note || `Status updated to ${orderStatus}`,
          updatedBy: 'admin',
          changedAt: new Date()
        }
      };
    }

    const updatedOrder = await Order.findByIdAndUpdate(
      req.params.id,
      updates,
      { new: true, runValidators: true }
    )
      .populate('userId',          'email firstName lastName phone')
      .populate('items.productId', 'name images price');

    res.status(200).json({
      success: true,
      message: 'Order updated successfully',
      order:   updatedOrder
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Cancel order (user or admin) ──────────────────────────────────────── */
export const cancelOrder = async (req, res, next) => {
  try {
    const order = await Order.findById(req.params.id);
    if (!order) throw createError('Order not found', 404);

    const isOwner = order.userId.toString() === req.user.id;
    const isAdmin = req.user.role === 'admin';
    if (!isOwner && !isAdmin) throw createError('Access denied', 403);

    // Only allow cancellation of pending/processing orders by users
    if (!isAdmin && !['pending', 'processing'].includes(order.orderStatus)) {
      throw createError(
        'Order cannot be cancelled at this stage. Please contact support.',
        400
      );
    }

    order.orderStatus  = 'cancelled';
    order.cancelledAt  = new Date();
    order.statusHistory.push({
      status:    'cancelled',
      note:      req.body.reason || 'Order cancelled by user',
      updatedBy: isAdmin ? 'admin' : req.user.id,
      changedAt: new Date()
    });

    await order.save();

    res.status(200).json({
      success: true,
      message: 'Order cancelled successfully',
      order
    });
  } catch (error) {
    next(error);
  }
};

/* ─── Get order stats (admin) ────────────────────────────────────────────── */
export const getOrderStats = async (req, res, next) => {
  try {
    const [statusCounts, revenueData] = await Promise.all([
      Order.aggregate([
        { $group: { _id: '$orderStatus', count: { $sum: 1 } } }
      ]),
      Order.aggregate([
        { $match: { orderStatus: { $ne: 'cancelled' } } },
        { $group: { _id: null, total: { $sum: '$totalPrice' }, count: { $sum: 1 } } }
      ])
    ]);

    const stats = {
      byStatus: statusCounts.reduce((acc, s) => {
        acc[s._id] = s.count;
        return acc;
      }, {}),
      totalRevenue: revenueData[0]?.total  || 0,
      totalOrders:  revenueData[0]?.count  || 0
    };

    res.status(200).json({ success: true, stats });
  } catch (error) {
    next(error);
  }
};

export default {
  placeOrder,
  getMyOrders,
  getAllOrders,
  getOrderById,
  updateOrderStatus,
  updateOrder,
  cancelOrder,
  getOrderStats
};
