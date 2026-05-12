import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { orderService } from '../services/orderService';
import { formatDate, formatPrice } from '../utils/formatters';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import toast from 'react-hot-toast';

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-[#00FF88]/15 text-[#00A85A]',
  cancelled:  'bg-red-100 text-red-600',
};

const PAYMENT_STYLES = {
  pending:   'text-amber-600',
  completed: 'text-[#00A85A]',
  failed:    'text-red-500',
  refunded:  'text-purple-600',
};

const OrderHistory = () => {
  const [orders, setOrders]     = useState([]);
  const [loading, setLoading]   = useState(true);
  const [expandedId, setExpandedId] = useState(null);
  const [cancelling, setCancelling] = useState(null);

  const fetchOrders = async () => {
    try {
      const response = await orderService.getMyOrders();
      setOrders(response.orders || []);
    } catch {
      setOrders([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => { fetchOrders(); }, []);

  const handleCancel = async (orderId) => {
    if (!window.confirm('Cancel this order?')) return;
    setCancelling(orderId);
    try {
      await orderService.cancelOrder(orderId);
      toast.success('Order cancelled');
      await fetchOrders();
    } catch (err) {
      toast.error(err?.message || 'Could not cancel order');
    } finally {
      setCancelling(null);
    }
  };

  if (loading) return <LoadingSkeleton type="page" />;

  return (
    <motion.div
      initial={{ opacity: 0, y: 18 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.35 }}
      className="space-y-6 pb-12"
    >
      <div>
        <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">
          Purchase record
        </p>
        <h1 className="mt-2 text-3xl font-semibold text-black">Order history</h1>
      </div>

      {orders.length === 0 ? (
        <div className="flex flex-col items-center justify-center gap-6 rounded-[28px] border border-black/5 bg-white p-14 text-center shadow-sm">
          <div className="text-5xl">📦</div>
          <div>
            <h2 className="text-2xl font-semibold text-black">No orders yet</h2>
            <p className="mt-2 text-black/55">
              Your order history will appear here once you place your first order.
            </p>
          </div>
          <Link
            to="/products"
            className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
          >
            Start shopping
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => {
            const isExpanded = expandedId === order._id;
            const canCancel  = ['pending', 'processing'].includes(order.orderStatus);

            return (
              <div
                key={order._id}
                className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm"
              >
                {/* Header row — click to expand */}
                <button
                  type="button"
                  onClick={() => setExpandedId(isExpanded ? null : order._id)}
                  className="flex w-full items-center justify-between gap-4 p-5 text-left"
                >
                  <div className="min-w-0">
                    <div className="flex flex-wrap items-center gap-3">
                      <h3 className="text-base font-semibold text-black">
                        Order #{order._id.slice(-8).toUpperCase()}
                      </h3>
                      <span
                        className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                          STATUS_STYLES[order.orderStatus] || 'bg-black/5 text-black/50'
                        }`}
                      >
                        {order.orderStatus}
                      </span>
                      <span
                        className={`text-xs font-semibold ${
                          PAYMENT_STYLES[order.paymentStatus] || 'text-black/40'
                        }`}
                      >
                        {order.paymentStatus}
                      </span>
                    </div>
                    <p className="mt-1 text-sm text-black/45">
                      {formatDate(order.createdAt)} ·{' '}
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-lg font-semibold text-black">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <span
                      className={`text-black/40 transition-transform duration-200 ${
                        isExpanded ? 'rotate-180' : ''
                      }`}
                    >
                      ▾
                    </span>
                  </div>
                </button>

                {/* Expanded detail */}
                <AnimatePresence>
                  {isExpanded && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.22 }}
                      className="overflow-hidden"
                    >
                      <div className="border-t border-black/5 px-5 pb-5 pt-4 space-y-4">
                        {/* Items */}
                        {order.items?.length > 0 && (
                          <div>
                            <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/38">
                              Items ordered
                            </p>
                            <div className="space-y-2">
                              {order.items.map((item, i) => (
                                <div
                                  key={i}
                                  className="flex items-center gap-3 rounded-2xl bg-black/[0.02] px-3 py-2"
                                >
                                  {item.image && (
                                    <img
                                      src={item.image}
                                      alt={item.productName}
                                      className="h-12 w-12 rounded-xl object-cover"
                                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                                    />
                                  )}
                                  <div className="min-w-0 flex-1">
                                    <p className="truncate text-sm font-semibold text-black">
                                      {item.productName}
                                    </p>
                                    <p className="text-xs text-black/45">
                                      {item.size && `Size ${item.size}`}
                                      {item.color && ` · ${item.color}`}
                                      {` · Qty ${item.quantity}`}
                                    </p>
                                  </div>
                                  <span className="shrink-0 text-sm font-semibold text-black">
                                    {formatPrice(item.price * item.quantity)}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Shipping address */}
                        {order.shippingAddress && (
                          <div>
                            <p className="mb-1 text-xs font-semibold uppercase tracking-[0.2em] text-black/38">
                              Shipping to
                            </p>
                            <p className="text-sm text-black/60">
                              {order.shippingAddress.firstName} {order.shippingAddress.lastName} ·{' '}
                              {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                              {order.shippingAddress.state} {order.shippingAddress.postalCode},{' '}
                              {order.shippingAddress.country}
                            </p>
                          </div>
                        )}

                        {/* Totals */}
                        <div className="flex flex-wrap gap-4 text-sm text-black/55">
                          <span>Subtotal: {formatPrice(order.subtotal)}</span>
                          <span>Shipping: {formatPrice(order.shippingCost)}</span>
                          <span className="font-semibold text-black">
                            Total: {formatPrice(order.totalPrice)}
                          </span>
                        </div>

                        {/* Actions */}
                        {canCancel && (
                          <div className="flex gap-3 pt-1">
                            <button
                              type="button"
                              onClick={() => handleCancel(order._id)}
                              disabled={cancelling === order._id}
                              className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 transition hover:bg-red-50 disabled:opacity-50"
                            >
                              {cancelling === order._id ? 'Cancelling…' : 'Cancel order'}
                            </button>
                          </div>
                        )}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      )}
    </motion.div>
  );
};

export default OrderHistory;
