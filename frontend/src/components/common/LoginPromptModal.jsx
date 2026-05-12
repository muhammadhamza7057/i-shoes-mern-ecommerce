/**
 * LoginPromptModal
 * ─────────────────
 * Shown when a guest user attempts a protected action (add to cart, wishlist,
 * checkout). Preserves the user's intent so after login they return to the
 * same page / action context.
 *
 * Usage:
 *   const { promptLogin } = useLoginPrompt();
 *   promptLogin('add to cart');   // opens modal with context message
 */
import React from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import { Link, useLocation } from 'react-router-dom';

const LoginPromptModal = ({ isOpen, onClose, actionLabel = 'continue' }) => {
  const location = useLocation();
  const returnTo = encodeURIComponent(location.pathname + location.search);

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="fixed inset-0 z-[200] grid place-items-center px-4"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          onClick={onClose}
          aria-modal="true"
          role="dialog"
          aria-label="Sign in required"
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" />

          {/* Panel */}
          <motion.div
            initial={{ opacity: 0, y: 28, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 16, scale: 0.97 }}
            transition={{ type: 'spring', stiffness: 340, damping: 30 }}
            onClick={(e) => e.stopPropagation()}
            className="relative z-10 w-full max-w-md overflow-hidden rounded-[32px] bg-white p-8 shadow-[0_40px_100px_rgba(0,0,0,0.22)]"
          >
            {/* Top accent bar */}
            <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#00FF88] to-transparent" />

            {/* Icon */}
            <div className="mx-auto mb-6 grid h-16 w-16 place-items-center rounded-2xl bg-black text-white shadow-[0_12px_32px_rgba(11,11,11,0.18)]">
              <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
                <circle cx="12" cy="7" r="4" />
              </svg>
            </div>

            <div className="text-center">
              <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/40">
                Sign in required
              </p>
              <h2 className="mt-3 text-2xl font-semibold text-black">
                You need an account to {actionLabel}
              </h2>
              <p className="mt-3 text-sm leading-7 text-black/55">
                Create a free account or sign in to save items, track orders, and enjoy a seamless checkout experience.
              </p>
            </div>

            <div className="mt-8 flex flex-col gap-3">
              <Link
                to={`/login?returnTo=${returnTo}`}
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
              >
                Sign in
              </Link>
              <Link
                to={`/register?returnTo=${returnTo}`}
                onClick={onClose}
                className="flex w-full items-center justify-center rounded-full border border-black/10 py-3.5 text-sm font-semibold text-black transition hover:bg-black/5"
              >
                Create account — it's free
              </Link>
              <button
                type="button"
                onClick={onClose}
                className="mt-1 text-sm text-black/40 transition hover:text-black/70"
              >
                Continue browsing
              </button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default LoginPromptModal;
