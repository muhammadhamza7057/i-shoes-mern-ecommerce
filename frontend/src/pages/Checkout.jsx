import React, { useCallback, useEffect, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { orderService } from '../services/orderService';
import { paymentService } from '../services/paymentService';
import { useCart } from '../hooks/useCart';
import { useAuth } from '../hooks/useAuth';
import { formatPrice } from '../utils/formatters';

/* ─── Field definitions ──────────────────────────────────────────────────── */
const SHIPPING_FIELDS = [
  { key: 'firstName',  label: 'First name',     type: 'text',  required: true, half: true,  autoComplete: 'given-name'    },
  { key: 'lastName',   label: 'Last name',      type: 'text',  required: true, half: true,  autoComplete: 'family-name'   },
  { key: 'email',      label: 'Email address',  type: 'email', required: true, half: false, autoComplete: 'email'         },
  { key: 'phone',      label: 'Phone number',   type: 'tel',   required: true, half: false, autoComplete: 'tel'           },
  { key: 'street',     label: 'Street address', type: 'text',  required: true, half: false, autoComplete: 'street-address'},
  { key: 'city',       label: 'City',           type: 'text',  required: true, half: true,  autoComplete: 'address-level2'},
  { key: 'state',      label: 'State / Region', type: 'text',  required: true, half: true,  autoComplete: 'address-level1'},
  { key: 'postalCode', label: 'Postal code',    type: 'text',  required: true, half: true,  autoComplete: 'postal-code'   },
  { key: 'country',    label: 'Country',        type: 'text',  required: true, half: true,  autoComplete: 'country-name'  },
];

/* ─── Per-field validation ───────────────────────────────────────────────── */
const validateField = (key, value) => {
  const v = value?.trim() ?? '';
  if (!v) return 'This field is required.';
  switch (key) {
    case 'email':
      if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v))
        return 'Enter a valid email address.';
      break;
    case 'phone':
      if (!/^[\d\s+\-()]{7,20}$/.test(v))
        return 'Enter a valid phone number (7–20 digits).';
      break;
    case 'postalCode':
      if (v.length < 3)
        return 'Enter a valid postal code.';
      break;
    default:
      if (v.length < 2)
        return 'Must be at least 2 characters.';
  }
  return null;
};

/* ─── Shared input class ─────────────────────────────────────────────────── */
const inputBase =
  'w-full rounded-2xl border px-4 py-3 text-sm text-black placeholder:text-black/30 focus:outline-none focus:ring-2 transition-all duration-200';

/* ─── Checkout component ─────────────────────────────────────────────────── */
const Checkout = () => {
  const navigate = useNavigate();
  const { cartItems, totalPrice, clearCart } = useCart();
  const { user, token } = useAuth();

  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [loading, setLoading]             = useState(false);
  const [submitted, setSubmitted]         = useState(false); // duplicate-submit guard
  const [submitError, setSubmitError]     = useState('');
  const [fieldErrors, setFieldErrors]     = useState({});
  const [touched, setTouched]             = useState({});

  const formRef = useRef(null);

  const [form, setForm] = useState({
    firstName:  user?.firstName || '',
    lastName:   user?.lastName  || '',
    email:      user?.email     || '',
    phone:      user?.phone     || '',
    street:     '',
    city:       '',
    state:      '',
    postalCode: '',
    country:    'USA',
  });

  /* Sync user data if it loads after mount */
  useEffect(() => {
    if (user) {
      setForm((prev) => ({
        ...prev,
        firstName: prev.firstName || user.firstName || '',
        lastName:  prev.lastName  || user.lastName  || '',
        email:     prev.email     || user.email     || '',
        phone:     prev.phone     || user.phone     || '',
      }));
    }
  }, [user]);

  const shippingCost = totalPrice > 100 ? 0 : 10;
  const orderTotal   = totalPrice + shippingCost;

  /* ── Field change handler ─────────────────────────────────────────────── */
  const handleChange = useCallback((key) => (e) => {
    const val = e.target.value;
    setForm((prev) => ({ ...prev, [key]: val }));
    if (touched[key]) {
      setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, val) }));
    }
  }, [touched]);

  /* ── Blur handler ─────────────────────────────────────────────────────── */
  const handleBlur = useCallback((key) => () => {
    setTouched((prev) => ({ ...prev, [key]: true }));
    setFieldErrors((prev) => ({ ...prev, [key]: validateField(key, form[key]) }));
  }, [form]);

  /* ── Validate all + focus first error ────────────────────────────────── */
  const validateAll = useCallback(() => {
    const errors = {};
    const allTouched = {};
    let firstErrorKey = null;

    SHIPPING_FIELDS.forEach(({ key }) => {
      allTouched[key] = true;
      const err = validateField(key, form[key]);
      if (err) {
        errors[key] = err;
        if (!firstErrorKey) firstErrorKey = key;
      }
    });

    setFieldErrors(errors);
    setTouched(allTouched);

    // Focus the first invalid field
    if (firstErrorKey && formRef.current) {
      const el = formRef.current.querySelector(`#co-${firstErrorKey}`);
      if (el) {
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        setTimeout(() => el.focus(), 200);
      }
    }

    return Object.keys(errors).length === 0;
  }, [form]);

  /* ── Submit ───────────────────────────────────────────────────────────── */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitError('');

    /* Session check */
    if (!token) {
      toast.error('Your session has expired. Please log in again.');
      navigate('/login?returnTo=%2Fcheckout');
      return;
    }

    /* Empty cart */
    if (!cartItems.length) {
      setSubmitError('Your cart is empty. Add products before checking out.');
      return;
    }

    /* Quantity sanity */
    const badQty = cartItems.find((i) => !i.quantity || i.quantity < 1);
    if (badQty) {
      setSubmitError(`Invalid quantity for "${badQty.name}". Please update your cart.`);
      return;
    }

    /* Field validation */
    if (!validateAll()) {
      setSubmitError('Please fix the highlighted errors before continuing.');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    /* Duplicate submission guard */
    if (submitted || loading) {
      toast('Your order is already being processed…', { icon: '⏳' });
      return;
    }

    setLoading(true);
    setSubmitted(true);

    try {
      const orderPayload = {
        items: cartItems.map((item) => ({
          productId: item._id,
          quantity:  item.quantity,
          price:     item.finalPrice ?? item.price,
          size:      item.selectedSize  || undefined,
          color:     item.selectedColor || undefined,
        })),
        shippingAddress: form,
        paymentMethod,
        shippingCost,
        discount: 0,
      };

      /* Stripe flow */
      if (paymentMethod === 'stripe') {
        const createdOrder = await orderService.createOrder(orderPayload);
        const session = await paymentService.createStripeCheckoutSession({
          items: cartItems.map((item) => ({
            name:     item.name,
            price:    item.finalPrice ?? item.price,
            quantity: item.quantity,
            image:    item.images?.[0]?.url || '',
          })),
          successUrl: `${window.location.origin}/orders`,
          cancelUrl:  `${window.location.origin}/cart`,
          orderId:    createdOrder.order?._id,
        });
        clearCart();
        window.location.href = session.url;
        return;
      }

      /* COD flow */
      await orderService.createOrder(orderPayload);
      clearCart();

      toast.success('Order placed successfully! 🎉', { duration: 4000 });
      navigate('/orders');
    } catch (err) {
      /* Reset duplicate guard so user can retry */
      setSubmitted(false);

      /* Parse backend error */
      let msg = 'Failed to place order. Please try again.';
      if (err?.message) msg = err.message;
      else if (err?.details) msg = err.details;
      else if (Array.isArray(err?.errors)) {
        msg = err.errors.map((e) => e.message || e.msg).join(' · ');
      }

      /* Stock-specific error */
      if (msg.toLowerCase().includes('stock') || msg.toLowerCase().includes('insufficient')) {
        toast.error(msg, { duration: 5000 });
      } else {
        setSubmitError(msg);
      }

      window.scrollTo({ top: 0, behavior: 'smooth' });
    } finally {
      setLoading(false);
    }
  };

  /* ── Empty cart guard ─────────────────────────────────────────────────── */
  if (!cartItems.length) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex min-h-[55vh] flex-col items-center justify-center gap-6 text-center"
      >
        <div className="grid h-20 w-20 place-items-center rounded-3xl bg-black/5 text-4xl">
          🛒
        </div>
        <div>
          <h2 className="text-2xl font-semibold text-black">Your cart is empty</h2>
          <p className="mt-2 text-black/55">Add some products before checking out.</p>
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

  /* ── Main render ──────────────────────────────────────────────────────── */
  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 pb-16"
    >
      {/* Header */}
      <div>
        <p className="text-xs font-bold uppercase tracking-[0.35em] text-black/40">
          Final step
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-black">Checkout</h1>
      </div>

      {/* Top-level error banner */}
      <AnimatePresence>
        {submitError && (
          <motion.div
            key="submit-error"
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, height: 0 }}
            className="flex items-start gap-3 rounded-2xl border border-red-200 bg-red-50 px-4 py-3.5"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" className="mt-0.5 shrink-0">
              <circle cx="12" cy="12" r="10" />
              <path d="M12 8v4M12 16h.01" />
            </svg>
            <p className="text-sm font-medium text-red-700">{submitError}</p>
            <button
              type="button"
              onClick={() => setSubmitError('')}
              className="ml-auto shrink-0 text-red-400 hover:text-red-600 transition"
              aria-label="Dismiss"
            >
              ✕
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      <form ref={formRef} onSubmit={handleSubmit} noValidate>
        <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_390px]">
          {/* ── Shipping form ──────────────────────────────────────────── */}
          <div className="space-y-6 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/40">
                Delivery details
              </p>
              <h2 className="mt-1 text-xl font-semibold text-black">Shipping address</h2>
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              {SHIPPING_FIELDS.map((field) => {
                const hasError = touched[field.key] && fieldErrors[field.key];
                const isValid  = touched[field.key] && !fieldErrors[field.key] && form[field.key]?.trim();
                return (
                  <div key={field.key} className={field.half ? '' : 'sm:col-span-2'}>
                    <label
                      htmlFor={`co-${field.key}`}
                      className="mb-1.5 block text-xs font-semibold uppercase tracking-[0.18em] text-black/45"
                    >
                      {field.label}
                      {field.required && <span className="ml-1 text-red-400">*</span>}
                    </label>
                    <div className="relative">
                      <input
                        id={`co-${field.key}`}
                        type={field.type}
                        value={form[field.key]}
                        onChange={handleChange(field.key)}
                        onBlur={handleBlur(field.key)}
                        placeholder={field.label}
                        autoComplete={field.autoComplete}
                        aria-invalid={hasError ? 'true' : 'false'}
                        aria-describedby={hasError ? `co-${field.key}-error` : undefined}
                        className={`${inputBase} ${
                          hasError
                            ? 'border-red-300 bg-red-50/40 pr-10 focus:ring-red-200/60'
                            : isValid
                            ? 'border-[#00FF88]/50 bg-[#00FF88]/[0.02] pr-10 focus:ring-[#00FF88]/20'
                            : 'border-black/10 bg-black/[0.02] focus:border-black/25 focus:bg-white focus:ring-[#00FF88]/20'
                        }`}
                      />
                      {/* Validation icon */}
                      {hasError && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-red-400">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <circle cx="12" cy="12" r="10" />
                            <path d="M12 8v4M12 16h.01" />
                          </svg>
                        </span>
                      )}
                      {isValid && (
                        <span className="absolute right-3.5 top-1/2 -translate-y-1/2 text-[#00A85A]">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                            <path d="M20 6 9 17l-5-5" />
                          </svg>
                        </span>
                      )}
                    </div>
                    <AnimatePresence>
                      {hasError && (
                        <motion.p
                          id={`co-${field.key}-error`}
                          role="alert"
                          initial={{ opacity: 0, y: -4, height: 0 }}
                          animate={{ opacity: 1, y: 0, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.18 }}
                          className="mt-1.5 flex items-center gap-1.5 overflow-hidden text-xs font-medium text-red-500"
                        >
                          <span aria-hidden="true">⚠</span>
                          {fieldErrors[field.key]}
                        </motion.p>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>

            {/* Payment method */}
            <div>
              <p className="mb-3 text-xs font-bold uppercase tracking-[0.28em] text-black/40">
                Payment method
              </p>
              <div className="grid gap-3 sm:grid-cols-2">
                {[
                  { value: 'cod',    label: 'Cash on Delivery', desc: 'Pay when your order arrives', icon: '💵' },
                  { value: 'stripe', label: 'Card / Stripe',    desc: 'Secure online payment',       icon: '💳' },
                ].map((method) => (
                  <label
                    key={method.value}
                    className={`flex cursor-pointer items-start gap-3 rounded-2xl border p-4 transition-all duration-200 ${
                      paymentMethod === method.value
                        ? 'border-black bg-black/[0.03] shadow-sm'
                        : 'border-black/10 hover:border-black/25'
                    }`}
                  >
                    <input
                      type="radio"
                      name="paymentMethod"
                      value={method.value}
                      checked={paymentMethod === method.value}
                      onChange={() => setPaymentMethod(method.value)}
                      className="mt-0.5 accent-black"
                    />
                    <div>
                      <p className="flex items-center gap-2 text-sm font-semibold text-black">
                        <span>{method.icon}</span>
                        {method.label}
                      </p>
                      <p className="mt-0.5 text-xs text-black/45">{method.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>
          </div>

          {/* ── Order summary ──────────────────────────────────────────── */}
          <aside className="h-fit space-y-4 rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
            <div>
              <p className="text-xs font-bold uppercase tracking-[0.28em] text-black/40">
                Your order
              </p>
              <h2 className="mt-1 text-xl font-semibold text-black">Summary</h2>
            </div>

            {/* Items */}
            <div className="space-y-2.5">
              {cartItems.map((item) => (
                <div
                  key={item.cartId || item._id}
                  className="flex items-center gap-3 rounded-2xl bg-black/[0.02] px-3 py-2.5"
                >
                  <div className="h-12 w-12 shrink-0 overflow-hidden rounded-xl bg-black/5">
                    <img
                      src={item.images?.[0]?.url || 'https://via.placeholder.com/80'}
                      alt={item.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/80?text=I'; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-black">{item.name}</p>
                    <p className="text-xs text-black/45">
                      {item.selectedSize  && `Size ${item.selectedSize}`}
                      {item.selectedColor && ` · ${item.selectedColor}`}
                      {` · Qty ${item.quantity}`}
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-black">
                    {formatPrice((item.finalPrice ?? item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Totals */}
            <div className="space-y-2 border-t border-black/5 pt-4 text-sm">
              <div className="flex justify-between text-black/60">
                <span>Subtotal</span>
                <span>{formatPrice(totalPrice)}</span>
              </div>
              <div className="flex justify-between text-black/60">
                <span>Shipping</span>
                <span>{shippingCost === 0 ? 'Free' : formatPrice(shippingCost)}</span>
              </div>
              {shippingCost === 0 && (
                <p className="flex items-center gap-1.5 text-xs text-[#00A85A]">
                  <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                    <path d="M20 6 9 17l-5-5" />
                  </svg>
                  Free shipping on orders over $100
                </p>
              )}
              <div className="flex justify-between border-t border-black/5 pt-3 text-base font-semibold text-black">
                <span>Total</span>
                <span>{formatPrice(orderTotal)}</span>
              </div>
            </div>

            {/* Submit */}
            <button
              type="submit"
              disabled={loading || submitted}
              className="flex w-full items-center justify-center gap-2 rounded-full bg-black py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-50 disabled:translate-y-0"
            >
              {loading ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Placing order…
                </>
              ) : submitted ? (
                <>
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
                  Processing…
                </>
              ) : (
                `Place order · ${formatPrice(orderTotal)}`
              )}
            </button>

            {/* Security note */}
            <div className="flex items-center justify-center gap-2 text-xs text-black/35">
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
                <path d="M7 11V7a5 5 0 0 1 10 0v4" />
              </svg>
              Secure checkout · Your data is protected
            </div>
          </aside>
        </div>
      </form>
    </motion.div>
  );
};

export default Checkout;
