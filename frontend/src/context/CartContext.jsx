import React, { createContext, useState, useEffect, useCallback, useContext } from 'react';
import { APP_CONSTANTS } from '../utils/constants';
import { AuthContext } from './AuthContext';

export const CartContext = createContext();

/**
 * CartContext
 * ───────────
 * - Cart is stored in localStorage under a per-user key when logged in
 * - Falls back to a guest key when not authenticated
 * - On login: user's saved cart is restored automatically
 * - On logout: cart is preserved in user-keyed slot, active cart is cleared from display
 * - finalPrice is used for price calculation (respects discounts)
 */
export const CartProvider = ({ children }) => {
  const auth = useContext(AuthContext);
  const userId = auth?.user?._id || null;

  // Derive the correct storage key based on auth state
  const cartKey = userId
    ? `${APP_CONSTANTS.STORAGE_KEYS.CART}_${userId}`
    : APP_CONSTANTS.STORAGE_KEYS.CART;

  const [cartItems, setCartItems] = useState([]);

  // Load cart from localStorage whenever the user changes (login/logout)
  useEffect(() => {
    try {
      const stored = localStorage.getItem(cartKey);
      setCartItems(stored ? JSON.parse(stored) : []);
    } catch {
      setCartItems([]);
    }
  }, [cartKey]);

  // Persist cart to localStorage on every change
  useEffect(() => {
    localStorage.setItem(cartKey, JSON.stringify(cartItems));
  }, [cartItems, cartKey]);

  // Derived values
  const totalPrice = cartItems.reduce(
    (sum, item) => sum + ((item.finalPrice ?? item.price) * item.quantity),
    0
  );
  const itemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  const getItemKey = (item) => item.cartId || item._id;

  const addToCart = useCallback((product) => {
    const size  = product.selectedSize  || product.sizes?.[0]  || 'any';
    const color = product.selectedColor || product.colors?.[0] || 'any';
    const cartId = `${product._id}-${size}-${color}`;

    setCartItems((prev) => {
      const existing = prev.find((i) => getItemKey(i) === cartId);
      if (existing) {
        return prev.map((i) =>
          getItemKey(i) === cartId ? { ...i, quantity: i.quantity + 1 } : i
        );
      }
      return [
        ...prev,
        {
          ...product,
          cartId,
          selectedSize: size,
          selectedColor: color,
          quantity: 1,
        },
      ];
    });
  }, []);

  const removeFromCart = useCallback((cartId) => {
    setCartItems((prev) => prev.filter((i) => getItemKey(i) !== cartId));
  }, []);

  const updateQuantity = useCallback((cartId, quantity) => {
    if (quantity <= 0) {
      removeFromCart(cartId);
      return;
    }
    setCartItems((prev) =>
      prev.map((i) => (getItemKey(i) === cartId ? { ...i, quantity } : i))
    );
  }, [removeFromCart]);

  /**
   * clearCart — removes items from display AND from the active storage key.
   * Called after a successful order placement.
   */
  const clearCart = useCallback(() => {
    setCartItems([]);
    localStorage.removeItem(cartKey);
  }, [cartKey]);

  const value = {
    cartItems,
    totalPrice,
    itemCount,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
  };

  return (
    <CartContext.Provider value={value}>
      {children}
    </CartContext.Provider>
  );
};

export default CartContext;
