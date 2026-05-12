import Cart from '../models/Cart.js';
import Product from '../models/Product.js';
import { createError } from '../middleware/errorHandler.js';

const getOrCreateCart = async (userId) => {
  let cart = await Cart.findOne({ userId });
  if (!cart) {
    cart = await Cart.create({ userId, items: [] });
  }
  return cart;
};

export const getCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.populate('items.productId', 'name price images stock');
    res.status(200).json({ success: true, cart });
  } catch (error) {
    next(error);
  }
};

export const addToCart = async (req, res, next) => {
  try {
    const { productId, quantity = 1, size, color } = req.body;
    const product = await Product.findById(productId);
    if (!product) throw createError('Product not found', 404);

    const cart = await getOrCreateCart(req.user.id);
    await cart.addItem(productId, quantity, size, color, product);
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({ success: true, message: 'Item added to cart', cart });
  } catch (error) {
    next(error);
  }
};

export const updateCartItem = async (req, res, next) => {
  try {
    const { quantity } = req.body;
    const cart = await getOrCreateCart(req.user.id);
    await cart.updateQuantity(req.params.itemId, quantity);
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({ success: true, message: 'Cart updated successfully', cart });
  } catch (error) {
    next(error);
  }
};

export const removeCartItem = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.removeItem(req.params.itemId);
    await cart.populate('items.productId', 'name price images stock');

    res.status(200).json({ success: true, message: 'Item removed from cart', cart });
  } catch (error) {
    next(error);
  }
};

export const clearCart = async (req, res, next) => {
  try {
    const cart = await getOrCreateCart(req.user.id);
    await cart.clearCart();

    res.status(200).json({ success: true, message: 'Cart cleared successfully', cart });
  } catch (error) {
    next(error);
  }
};

export default {
  getCart,
  addToCart,
  updateCartItem,
  removeCartItem,
  clearCart
};
