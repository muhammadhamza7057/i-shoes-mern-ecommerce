import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import LoadingSkeleton from './LoadingSkeleton';

/**
 * ProtectedRoute
 * ──────────────
 * - While auth is loading → show skeleton
 * - Not authenticated → redirect to /login with returnTo param
 * - adminOnly + not admin → redirect to home
 * - Otherwise → render children
 *
 * For inline guest-action blocking (add to cart, wishlist) use
 * LoginPromptModal + useLoginPrompt instead of this component.
 */
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { isLoading, isAuthenticated, user } = useAuth();
  const location = useLocation();

  if (isLoading) {
    return <LoadingSkeleton type="page" />;
  }

  if (!isAuthenticated) {
    // Preserve the intended destination so Login can redirect back
    const returnTo = encodeURIComponent(location.pathname + location.search);
    return <Navigate to={`/login?returnTo=${returnTo}`} replace />;
  }

  if (adminOnly && user?.role !== 'admin') {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;
