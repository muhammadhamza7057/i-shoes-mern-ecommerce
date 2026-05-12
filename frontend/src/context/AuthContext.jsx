import React, { createContext, useState, useEffect, useCallback } from 'react';
import { APP_CONSTANTS } from '../utils/constants';

export const AuthContext = createContext();

/**
 * AuthProvider
 * ─────────────
 * Manages authentication state with:
 * - Persistent token + user in localStorage
 * - Per-user cart key so each user's cart is isolated
 * - Cart is PRESERVED on logout (not deleted) — restored on next login
 * - updateUser helper so profile edits reflect immediately in context
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser]       = useState(null);
  const [token, setToken]     = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const storedToken = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
      const storedUser  = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.USER);

      if (storedToken && storedUser) {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
      }
    } catch {
      // Corrupted storage — clear it
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    } finally {
      setIsLoading(false);
    }
  }, []);

  /**
   * login — called after successful API auth
   * Saves token + user, migrates any guest cart items to the user's cart key
   */
  const login = useCallback((userData, authToken) => {
    setUser(userData);
    setToken(authToken);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN, authToken);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(userData));

    // Migrate guest cart → user-specific cart key (merge, don't overwrite)
    const guestCartKey = APP_CONSTANTS.STORAGE_KEYS.CART;
    const userCartKey  = `${APP_CONSTANTS.STORAGE_KEYS.CART}_${userData._id}`;

    try {
      const guestCart = JSON.parse(localStorage.getItem(guestCartKey) || '[]');
      const userCart  = JSON.parse(localStorage.getItem(userCartKey)  || '[]');

      if (guestCart.length > 0) {
        // Merge: add guest items that aren't already in user cart
        const merged = [...userCart];
        guestCart.forEach((guestItem) => {
          const exists = merged.find((i) => (i.cartId || i._id) === (guestItem.cartId || guestItem._id));
          if (!exists) merged.push(guestItem);
        });
        localStorage.setItem(userCartKey, JSON.stringify(merged));
        // Clear guest cart after migration
        localStorage.removeItem(guestCartKey);
      }
    } catch {
      // Non-critical — ignore migration errors
    }
  }, []);

  /**
   * logout — clears auth state but PRESERVES the user's cart in their keyed slot
   * Cart is NOT deleted — it will be restored on next login
   */
  const logout = useCallback(() => {
    // Save current cart under user-specific key before clearing auth
    if (user?._id) {
      try {
        const currentCart = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.CART);
        if (currentCart) {
          localStorage.setItem(
            `${APP_CONSTANTS.STORAGE_KEYS.CART}_${user._id}`,
            currentCart
          );
        }
      } catch {
        // Non-critical
      }
    }

    setUser(null);
    setToken(null);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
    // NOTE: We intentionally do NOT remove the cart key here
    // The CartContext will handle clearing the active cart display
  }, [user]);

  /**
   * updateUser — update user data in context + localStorage (e.g. after profile edit)
   */
  const updateUser = useCallback((updatedData) => {
    const merged = { ...user, ...updatedData };
    setUser(merged);
    localStorage.setItem(APP_CONSTANTS.STORAGE_KEYS.USER, JSON.stringify(merged));
  }, [user]);

  const value = {
    user,
    token,
    isLoading,
    isAuthenticated: !!token,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
