import React, { createContext, useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { APP_CONSTANTS } from '../utils/constants';

export const WishlistContext = createContext();

// Correct storage key — was incorrectly using RECENTLY_VIEWED
const WISHLIST_KEY = APP_CONSTANTS.STORAGE_KEYS.WISHLIST || 'ishoes_wishlist';

export const WishlistProvider = ({ children }) => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // Hydrate from localStorage on mount
  useEffect(() => {
    try {
      const saved = localStorage.getItem(WISHLIST_KEY);
      if (saved) setWishlistItems(JSON.parse(saved));
    } catch {
      setWishlistItems([]);
    }
  }, []);

  // Persist to localStorage on change
  useEffect(() => {
    localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlistItems));
  }, [wishlistItems]);

  const toggleWishlist = (product) => {
    const exists = wishlistItems.some((item) => item._id === product._id);
    if (exists) {
      setWishlistItems((prev) => prev.filter((item) => item._id !== product._id));
      toast('Removed from wishlist', {
        icon: '🗑️',
        style: { fontWeight: 600 },
      });
    } else {
      setWishlistItems((prev) => [product, ...prev]);
      toast.success('Saved to wishlist');
    }
  };

  const isWishlisted = (productId) =>
    wishlistItems.some((item) => item._id === productId);

  const clearWishlist = () => setWishlistItems([]);

  return (
    <WishlistContext.Provider
      value={{ wishlistItems, toggleWishlist, isWishlisted, clearWishlist }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export default WishlistContext;
