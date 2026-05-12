import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { formatDate, formatPrice } from '../../utils/formatters';

const ORDER_STATUSES = ['pending', 'processing', 'shipped', 'delivered', 'cancelled'];

const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700 border-amber-200',
  processing: 'bg-blue-100 text-blue-700 border-blue-200',
  shipped:    'bg-purple-100 text-purple-700 border-purple-200',
  delivered:  'bg-[#00FF88]/15 text-[#00A85A] border-[#00FF88]/30',
  cancelled:  'bg-red-100 text-red-600 border-red-200',
};

const PAYMENT_STYLES = {
  pending:   'text-amber-600',
  completed: 'text-[#00A85A]',
  failed:    'text-red-500',
  refunded:  'text-purple-600',
};

const OrderManagement = ({ orders = [], onUpdateStatus }) => {
  const [expandedId, setExpandedId] = useState(null);
  const [filter, setFilter] = useState('all');

  const filtered = filter === 'all'
    ? orders
    : orders.filter((o) => o.orderStatus === filter);

  return (
    <div className="space-y-5">
      {/* Filter bar */}
      <div className="flex flex-wrap gap-2">
        {['all', ...ORDER_STATUSES].map((s) => (
          <button
            key={s}
            onClick={() => setFilter(s)}
            className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.16em] transition ${
              filter === s
                ? 'border-black bg-black text-white'
                : 'border-black/10 text-black/55 hover:bg-black/5'
            }`}
          >
            {s === 'all' ? `All (${orders.length})` : s}
          </button>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="rounded-[24px] border border-dashed border-black/12 p-8 text-center text-sm text-black/40">
          No orders match this filter.
        </div>
      )}

      {filtered.map((order) => {
        const isExpanded = expandedId === order._id;
        return (
          <div
            key={order._id}
            className="overflow-hidden rounded-[28px] border border-black/5 bg-white shadow-sm"
          >
            {/* Order header */}
            <button
              type="button"
              onClick={() => setExpandedId(isExpanded ? null : order._id)}
              className="flex w-full items-center justify-between gap-4 p-5 text-left"
            >
              <div className="min-w-0">
                <div className="flex flex-wrap items-center gap-3">
                  <h3 className="text-base font-semibold text-black">
                    #{order._id.slice(-8).toUpperCase()}
                  </h3>
                  <span
                    className={`rounded-full border px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] ${
                      STATUS_STYLES[order.orderStatus] || 'bg-black/5 text-black/50 border-black/10'
                    }`}
                  >
                    {order.orderStatus}
                  </span>
                  <span className={`text-xs font-semibold ${PAYMENT_STYLES[order.paymentStatus] || 'text-black/40'}`}>
                    {order.paymentStatus}
                  </span>
                </div>
                <p className="mt-1 text-sm text-black/45">
                  {order.userId?.email || order.userId?.firstName || 'Customer'} ·{' '}
                  {formatDate(order.createdAt)} · {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''}
                </p>
              </div>
              <div className="flex shrink-0 items-center gap-3">
                <span className="text-lg font-semibold text-black">
                  {formatPrice(order.totalPrice)}
                </span>
                <span className={`text-black/40 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}>
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
                  <div className="border-t border-black/5 px-5 pb-5 pt-4">
                    {/* Items */}
                    {order.items?.length > 0 && (
                      <div className="mb-4 space-y-2">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/38">Items</p>
                        {order.items.map((item, i) => (
                          <div key={i} className="flex items-center gap-3 rounded-2xl bg-black/[0.02] px-3 py-2">
                            {item.image && (
                              <img src={item.image} alt={item.productName} className="h-10 w-10 rounded-xl object-cover" />
                            )}
                            <div className="min-w-0 flex-1">
                              <p className="truncate text-sm font-semibold text-black">{item.productName}</p>
                              <p className="text-xs text-black/45">
                                {item.size && `Size ${item.size}`}{item.color && ` · ${item.color}`} · Qty {item.quantity}
                              </p>
                            </div>
                            <span className="text-sm font-semibold text-black">
                              {formatPrice(item.price * item.quantity)}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Shipping address */}
                    {order.shippingAddress && (
                      <div className="mb-4">
                        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/38">Ship to</p>
                        <p className="mt-1 text-sm text-black/60">
                          {order.shippingAddress.firstName} {order.shippingAddress.lastName} ·{' '}
                          {order.shippingAddress.street}, {order.shippingAddress.city},{' '}
                          {order.shippingAddress.country}
                        </p>
                      </div>
                    )}

                    {/* Status update buttons */}
                    <div>
                      <p className="mb-2 text-xs font-semibold uppercase tracking-[0.2em] text-black/38">
                        Update status
                      </p>
                      <div className="flex flex-wrap gap-2">
                        {ORDER_STATUSES.map((status) => (
                          <button
                            key={status}
                            onClick={() => onUpdateStatus(order._id, status)}
                            className={`rounded-full border px-3 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition ${
                              order.orderStatus === status
                                ? STATUS_STYLES[status] || 'border-black bg-black text-white'
                                : 'border-black/10 text-black/55 hover:bg-black/5'
                            }`}
                          >
                            {order.orderStatus === status ? `✓ ${status}` : status}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}
    </div>
  );
};

export default OrderManagement;
