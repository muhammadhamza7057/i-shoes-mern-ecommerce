/**
 * NotificationContext
 * ────────────────────
 * Lightweight admin notification system.
 * - Tracks new orders seen vs total orders
 * - Persists "last seen" count in localStorage
 * - Admin dashboard polls and updates this context
 * - Navbar badge reads unread count from here
 */
import React, { createContext, useCallback, useContext, useEffect, useState } from 'react';

export const NotificationContext = createContext();

const STORAGE_KEY = 'ishoes_admin_last_seen_orders';

export const NotificationProvider = ({ children }) => {
  const [totalOrders, setTotalOrders]   = useState(0);
  const [lastSeenCount, setLastSeenCount] = useState(() => {
    try {
      return parseInt(localStorage.getItem(STORAGE_KEY) || '0', 10);
    } catch {
      return 0;
    }
  });

  const unreadCount = Math.max(0, totalOrders - lastSeenCount);

  /**
   * Called by AdminDashboard after fetching orders
   * so the badge stays in sync with real data
   */
  const syncOrderCount = useCallback((count) => {
    setTotalOrders(count);
  }, []);

  /**
   * Called when admin opens the Orders tab — marks all as seen
   */
  const markAllSeen = useCallback(() => {
    setLastSeenCount(totalOrders);
    localStorage.setItem(STORAGE_KEY, String(totalOrders));
  }, [totalOrders]);

  return (
    <NotificationContext.Provider
      value={{ unreadCount, totalOrders, syncOrderCount, markAllSeen }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

export const useNotifications = () => {
  const ctx = useContext(NotificationContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationProvider');
  return ctx;
};

export default NotificationContext;
