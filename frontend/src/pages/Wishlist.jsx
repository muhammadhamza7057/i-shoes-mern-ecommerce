import React from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useWishlist } from '../hooks/useWishlist';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';
import LoginPromptModal from '../components/common/LoginPromptModal';
import { useLoginPrompt } from '../hooks/useLoginPrompt';

const Wishlist = () => {
  const { wishlistItems, toggleWishlist } = useWishlist();
  const { addToCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isOpen, actionLabel, promptLogin, closePrompt } = useLoginPrompt();

  const handleAddToCart = (product) => {
    if (!isAuthenticated) {
      promptLogin('add to cart');
      return;
    }
    addToCart({ ...product, quantity: 1 });
    toast.success('Added to cart');
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-8 pb-12"
    >
      <div className="flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">
            Saved items
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-black">
            Wishlist
            {wishlistItems.length > 0 && (
              <span className="ml-3 text-lg font-normal text-black/40">
                ({wishlistItems.length})
              </span>
            )}
          </h1>
        </div>
      </div>

      {wishlistItems.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-[28px] border border-black/5 bg-white p-14 text-center shadow-sm">
          <div className="text-5xl">♡</div>
          <div>
            <h2 className="text-2xl font-semibold text-black">Nothing saved yet</h2>
            <p className="mt-2 text-black/55">
              Tap the heart icon on any product to save it here.
            </p>
          </div>
          <Link
            to="/products"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Browse products
          </Link>
        </div>
      ) : (
        <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
          <AnimatePresence>
            {wishlistItems.map((product) => (
              <motion.div
                key={product._id}
                layout
                initial={{ opacity: 0, scale: 0.96 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.94, height: 0 }}
                transition={{ duration: 0.22 }}
                className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm"
              >
                {/* Image */}
                <Link to={`/products/${product._id}`} className="block">
                  <div className="aspect-[4/3] overflow-hidden bg-[linear-gradient(180deg,#f7f7f7_0%,#ededed_100%)]">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/400?text=I.Shoes'}
                      alt={product.name}
                      className="h-full w-full object-cover transition-transform duration-500 hover:scale-105"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/400?text=I.Shoes';
                      }}
                    />
                  </div>
                </Link>

                {/* Info */}
                <div className="p-5">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                        {product.brand}
                      </p>
                      <Link to={`/products/${product._id}`}>
                        <h2 className="mt-1 line-clamp-1 text-lg font-semibold text-black hover:text-[#00A85A] transition">
                          {product.name}
                        </h2>
                      </Link>
                    </div>
                    <div className="shrink-0 text-right">
                      <p className="text-lg font-semibold text-black">
                        {formatPrice(product.finalPrice ?? product.price)}
                      </p>
                      {product.discount > 0 && (
                        <p className="text-xs text-black/38 line-through">
                          {formatPrice(product.price)}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="mt-4 flex gap-2">
                    <button
                      type="button"
                      onClick={() => handleAddToCart(product)}
                      className="flex-1 rounded-full bg-black py-2.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
                    >
                      Add to Cart
                    </button>
                    <button
                      type="button"
                      onClick={() => toggleWishlist(product)}
                      className="rounded-full border border-black/10 px-4 py-2.5 text-sm font-semibold text-black transition hover:border-red-200 hover:text-red-500"
                      aria-label="Remove from wishlist"
                    >
                      ✕
                    </button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      <LoginPromptModal isOpen={isOpen} onClose={closePrompt} actionLabel={actionLabel} />
    </motion.div>
  );
};

export default Wishlist;
