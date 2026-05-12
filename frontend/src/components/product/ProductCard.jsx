import React, { useMemo, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import toast from 'react-hot-toast';
import { formatPrice } from '../../utils/formatters';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useAuth } from '../../hooks/useAuth';
import LoginPromptModal from '../common/LoginPromptModal';
import { useLoginPrompt } from '../../hooks/useLoginPrompt';

const ProductCard = ({ product, cardLinkMode = 'partial' }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  const { isOpen: promptOpen, actionLabel, promptLogin, closePrompt } = useLoginPrompt();

  const fallbackImage = 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=600&q=80';
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || null);
  const [quickViewOpen, setQuickViewOpen] = useState(false);
  const [addedFeedback, setAddedFeedback] = useState(false);

  const wishlisted = isWishlisted(product._id);

  const colorImage = useMemo(() => {
    if (!selectedColor) return product.images?.[0]?.url || fallbackImage;
    const match = product.images?.find(
      (img) => (img.color || '').toLowerCase() === selectedColor.toLowerCase()
    );
    return match?.url || product.images?.[0]?.url || fallbackImage;
  }, [selectedColor, product.images]);

  const handleAddToCart = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      promptLogin('add to cart');
      return;
    }
    addToCart({ ...product, quantity: 1, selectedColor });
    setAddedFeedback(true);
    setTimeout(() => setAddedFeedback(false), 1200);
    toast.success('Added to cart');
    try {
      window.dispatchEvent(
        new CustomEvent('cursor-burst', { detail: { color: '#00FF88' } })
      );
    } catch (_) {}
  };

  const handleWishlist = (e) => {
    e.stopPropagation();
    if (!isAuthenticated) {
      promptLogin('save to wishlist');
      return;
    }
    toggleWishlist(product);
  };

  const handleCardClick = (e) => {
    if (cardLinkMode !== 'full') return;
    if (e.target.closest('button, a')) return;
    navigate(`/products/${product._id}`);
  };

  return (
    <>
      <motion.article
        layout
        whileHover={{ y: -6, scale: 1.012 }}
        transition={{ duration: 0.28, ease: 'easeOut' }}
        className="group flex h-full flex-col overflow-hidden rounded-[32px] bg-white shadow-[0_20px_60px_rgba(11,11,11,0.07)] premium-border"
        data-cursor="view"
        style={{ transformStyle: 'preserve-3d' }}
        onClick={handleCardClick}
        role={cardLinkMode === 'full' ? 'link' : undefined}
        tabIndex={cardLinkMode === 'full' ? 0 : undefined}
        onKeyDown={(e) => {
          if (cardLinkMode !== 'full') return;
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault();
            navigate(`/products/${product._id}`);
          }
        }}
      >
        {/* ── Image area ─────────────────────────────────────────────── */}
        <div className="relative shrink-0">
          <Link to={`/products/${product._id}`} tabIndex={-1} aria-label={product.name}>
            <div className="relative aspect-[4/4.4] overflow-hidden bg-[linear-gradient(180deg,#f7f7f7_0%,#ededed_100%)]">
              <img
                src={colorImage}
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-700 group-hover:scale-108"
                loading="lazy"
                onError={(e) => {
                  e.currentTarget.onerror = null;
                  e.currentTarget.src = fallbackImage;
                }}
              />
              {/* Hover overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/18 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
            </div>
          </Link>

          {/* Badges */}
          <div className="absolute left-4 top-4 flex flex-col gap-2">
            {product.discount > 0 && (
              <span className="rounded-full bg-[#00FF88] px-3 py-1 text-xs font-bold text-black shadow-sm">
                -{product.discount}%
              </span>
            )}
            <span className="rounded-full bg-white/90 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/65 backdrop-blur">
              {product.collection}
            </span>
          </div>

          {/* Wishlist button */}
          <button
            type="button"
            onClick={handleWishlist}
            data-magnetic
            data-magnetic-strength="0.14"
            aria-label={wishlisted ? 'Remove from wishlist' : 'Save to wishlist'}
            className={`absolute right-4 top-4 rounded-full px-3 py-2 text-xs font-semibold shadow-sm backdrop-blur transition-all duration-200 ${
              wishlisted
                ? 'bg-[#00FF88] text-black scale-105'
                : 'bg-white/90 text-black hover:bg-[#00FF88]/20'
            }`}
          >
            {wishlisted ? '♥ Saved' : '♡ Save'}
          </button>

          {/* Quick view */}
          <motion.button
            type="button"
            onClick={(e) => { e.stopPropagation(); setQuickViewOpen(true); }}
            whileTap={{ scale: 0.96 }}
            data-magnetic
            data-magnetic-strength="0.16"
            className="absolute bottom-4 left-4 rounded-full bg-black/85 px-4 py-2 text-xs font-semibold uppercase tracking-[0.22em] text-white backdrop-blur transition hover:bg-[#00FF88] hover:text-black"
          >
            Quick View
          </motion.button>
        </div>

        {/* ── Info area ──────────────────────────────────────────────── */}
        <div className="flex flex-1 flex-col gap-3 p-5">
          <div className="flex items-center justify-between gap-2 text-[11px] font-semibold uppercase tracking-[0.22em] text-black/40">
            <span>{product.brand}</span>
            <span>★ {product.rating?.toFixed?.(1) ?? '4.8'}</span>
          </div>

          <Link to={`/products/${product._id}`} className="block">
            <h3 className="line-clamp-1 text-xl font-semibold text-black transition-colors group-hover:text-[#00A85A]">
              {product.name}
            </h3>
          </Link>

          <p className="line-clamp-2 text-sm leading-6 text-black/55">
            {product.description}
          </p>

          {/* Sizes + color swatches */}
          <div className="flex flex-wrap gap-2">
            {product.sizes?.slice(0, 4).map((size) => (
              <span
                key={size}
                className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-semibold text-black/60"
              >
                EU {size}
              </span>
            ))}
            {product.colors?.slice(0, 5).map((color) => (
              <button
                key={color}
                type="button"
                onClick={(e) => { e.stopPropagation(); setSelectedColor(color); }}
                onMouseEnter={() =>
                  window.dispatchEvent(
                    new CustomEvent('color-preview', { detail: { color } })
                  )
                }
                aria-label={`Select ${color}`}
                className={`relative h-7 w-7 rounded-full ring-1 ring-black/8 transition-transform ${
                  selectedColor === color
                    ? 'scale-115 ring-2 ring-[#00FF88] ring-offset-1'
                    : 'hover:scale-110'
                }`}
                style={{
                  background: color.startsWith('#') ? color : undefined,
                  backgroundColor: !color.startsWith('#') ? undefined : color,
                }}
              >
                {!color.startsWith('#') && (
                  <span className="absolute inset-0 grid place-items-center text-[10px] font-bold text-black/55">
                    {color[0].toUpperCase()}
                  </span>
                )}
              </button>
            ))}
          </div>

          {/* Price + CTA */}
          <div className="mt-auto flex items-end justify-between gap-3 pt-2">
            <div>
              <div className="text-2xl font-semibold text-black">
                {formatPrice(product.finalPrice ?? product.price)}
              </div>
              {product.discount > 0 && (
                <div className="text-sm text-black/38 line-through">
                  {formatPrice(product.price)}
                </div>
              )}
            </div>

            <motion.button
              type="button"
              onClick={handleAddToCart}
              whileTap={{ scale: 0.94 }}
              data-magnetic
              data-magnetic-strength="0.1"
              aria-label={`Add ${product.name} to cart`}
              className={`rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ${
                addedFeedback
                  ? 'bg-[#00FF88] text-black scale-105'
                  : 'bg-black text-white hover:-translate-y-0.5 hover:bg-[#111]'
              }`}
            >
              {addedFeedback ? '✓ Added' : 'Add to Cart'}
            </motion.button>
          </div>
        </div>
      </motion.article>

      {/* ── Quick View Modal ──────────────────────────────────────────── */}
      <AnimatePresence>
        {quickViewOpen && (
          <motion.div
            className="fixed inset-0 z-[180] grid place-items-center bg-black/55 px-4 py-8 backdrop-blur-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setQuickViewOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: 24, scale: 0.96 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 16, scale: 0.97 }}
              transition={{ duration: 0.25, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="grid w-full max-w-3xl gap-6 overflow-hidden rounded-[32px] bg-white p-4 shadow-[0_40px_100px_rgba(0,0,0,0.24)] md:grid-cols-[0.95fr_1.05fr] md:p-6"
            >
              <div className="overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#f7f7f7_0%,#ededed_100%)]">
                <img
                  src={colorImage}
                  alt={product.name}
                  className="h-full w-full object-cover"
                  onError={(e) => {
                    e.currentTarget.onerror = null;
                    e.currentTarget.src = fallbackImage;
                  }}
                />
              </div>
              <div className="flex flex-col justify-between gap-5 p-1 md:p-2">
                <div>
                  <p className="section-kicker">Quick view</p>
                  <h3 className="mt-3 text-3xl font-semibold text-black">{product.name}</h3>
                  <p className="mt-3 text-sm leading-7 text-black/60">{product.description}</p>
                  <div className="mt-4 flex flex-wrap gap-2 text-xs font-semibold uppercase tracking-[0.22em] text-black/45">
                    <span className="rounded-full bg-black/5 px-3 py-2">{product.brand}</span>
                    <span className="rounded-full bg-black/5 px-3 py-2">{product.collection}</span>
                    <span className="rounded-full bg-black/5 px-3 py-2">
                      ★ {product.rating?.toFixed?.(1) ?? '4.8'}
                    </span>
                  </div>
                </div>
                <div className="flex items-center justify-between gap-4">
                  <div>
                    <div className="text-3xl font-semibold text-black">
                      {formatPrice(product.finalPrice ?? product.price)}
                    </div>
                    {product.discount > 0 && (
                      <div className="text-sm text-black/38 line-through">
                        {formatPrice(product.price)}
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3">
                    <button
                      onClick={() => setQuickViewOpen(false)}
                      className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black"
                    >
                      Close
                    </button>
                    <Link
                      to={`/products/${product._id}`}
                      className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white"
                    >
                      Open product
                    </Link>
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Login Prompt Modal ────────────────────────────────────────── */}
      <LoginPromptModal
        isOpen={promptOpen}
        onClose={closePrompt}
        actionLabel={actionLabel}
      />
    </>
  );
};

export default ProductCard;
