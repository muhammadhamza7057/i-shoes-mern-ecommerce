import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';
import LoginPromptModal from '../components/common/LoginPromptModal';
import { useLoginPrompt } from '../hooks/useLoginPrompt';

const Cart = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, updateQuantity, removeFromCart, clearCart } = useCart();
  const { isAuthenticated } = useAuth();
  const { isOpen, actionLabel, promptLogin, closePrompt } = useLoginPrompt();

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const orderTotal   = totalPrice + shippingCost;

  const handleCheckout = () => {
    if (!isAuthenticated) {
      promptLogin('checkout');
      return;
    }
    navigate('/checkout');
  };

  if (!cartItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center"
      >
        <div className="text-6xl">🛒</div>
        <div>
          <h2 className="text-2xl font-semibold text-black">Your cart is empty</h2>
          <p className="mt-2 text-black/55">
            Browse the collection and add something you love.
          </p>
        </div>
        <Link
          to="/products"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          Browse products
        </Link>
      </motion.div>
    );
  }

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
            Your basket
          </p>
          <h1 className="mt-2 text-3xl font-semibold text-black">
            Cart ({cartItems.length} item{cartItems.length !== 1 ? 's' : ''})
          </h1>
        </div>
        <button
          type="button"
          onClick={clearCart}
          className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black/55 transition hover:border-red-200 hover:text-red-500"
        >
          Clear all
        </button>
      </div>

      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_380px]">
        {/* Items list */}
        <div className="space-y-4">
          <AnimatePresence>
            {cartItems.map((item) => {
              const itemKey   = item.cartId || item._id;
              const itemPrice = item.finalPrice ?? item.price;
              const imageUrl  = item.images?.[0]?.url || 'https://via.placeholder.com/220?text=I.Shoes';

              return (
                <motion.div
                  key={itemKey}
                  layout
                  initial={{ opacity: 0, y: 12 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, x: -20, height: 0 }}
                  transition={{ duration: 0.22 }}
                  className="flex flex-col gap-4 rounded-[28px] border border-black/5 bg-white p-5 shadow-sm md:flex-row md:items-center"
                >
                  {/* Image */}
                  <div className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl bg-black/5">
                    <img
                      src={imageUrl}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => {
                        e.currentTarget.onerror = null;
                        e.currentTarget.src = 'https://via.placeholder.com/220?text=I.Shoes';
                      }}
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <h3 className="text-base font-semibold text-black">{item.name}</h3>
                    <p className="mt-0.5 text-sm text-black/50">
                      {item.selectedSize && `Size ${item.selectedSize}`}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                    </p>
                    <p className="mt-1 text-sm font-semibold text-black">
                      {formatPrice(itemPrice)}
                      {item.discount > 0 && (
                        <span className="ml-2 text-xs font-normal text-black/38 line-through">
                          {formatPrice(item.price)}
                        </span>
                      )}
                    </p>
                  </div>

                  {/* Quantity controls */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => updateQuantity(itemKey, item.quantity - 1)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-sm font-semibold text-black transition hover:bg-black/5"
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <span className="w-8 text-center text-sm font-semibold text-black">
                      {item.quantity}
                    </span>
                    <button
                      type="button"
                      onClick={() => updateQuantity(itemKey, item.quantity + 1)}
                      className="grid h-9 w-9 place-items-center rounded-full border border-black/10 text-sm font-semibold text-black transition hover:bg-black/5"
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>

                  {/* Line total */}
                  <div className="text-right">
                    <p className="text-base font-semibold text-black">
                      {formatPrice(itemPrice * item.quantity)}
                    </p>
                    <button
                      type="button"
                      onClick={() => removeFromCart(itemKey)}
                      className="mt-1 text-xs font-medium text-red-400 transition hover:text-red-600"
                    >
                      Remove
                    </button>
                  </div>
                </motion.div>
              );
            })}
          </AnimatePresence>
        </div>

        {/* Order summary */}
        <aside className="h-fit rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <h3 className="text-xl font-semibold text-black">Order summary</h3>

          <div className="mt-5 space-y-3 text-sm">
            <div className="flex items-center justify-between text-black/60">
              <span>Subtotal</span>
              <span>{formatPrice(totalPrice)}</span>
            </div>
            <div className="flex items-center justify-between text-black/60">
              <span>Shipping</span>
              <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
            </div>
            {shippingCost === 0 && (
              <p className="text-xs text-[#00A85A]">✓ Free shipping on orders over $100</p>
            )}
            <div className="flex items-center justify-between border-t border-black/5 pt-3 text-base font-semibold text-black">
              <span>Total</span>
              <span>{formatPrice(orderTotal)}</span>
            </div>
          </div>

          <button
            type="button"
            onClick={() => navigate('/checkout')}
            className="mt-6 flex w-full items-center justify-center rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Proceed to checkout
          </button>

          <Link
            to="/products"
            className="mt-3 flex w-full items-center justify-center rounded-full border border-black/10 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
          >
            Continue shopping
          </Link>
        </aside>
      </div>
    </motion.div>
  );
};

export default Cart;
