import React from 'react';
import { motion } from 'framer-motion';
import { formatPrice, formatDate } from '../../utils/formatters';

/* ─── SVG stat icons ─────────────────────────────────────────────────────── */
const StatIcon = ({ type }) => {
  const icons = {
    products: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
        <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
        <line x1="12" y1="22.08" x2="12" y2="12" />
      </svg>
    ),
    orders: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
        <line x1="3" y1="6" x2="21" y2="6" />
        <path d="M16 10a4 4 0 0 1-8 0" />
      </svg>
    ),
    users: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
        <circle cx="9" cy="7" r="4" />
        <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
        <path d="M16 3.13a4 4 0 0 1 0 7.75" />
      </svg>
    ),
    revenue: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <line x1="12" y1="1" x2="12" y2="23" />
        <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
      </svg>
    ),
    rating: (
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
        <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
      </svg>
    ),
  };
  return icons[type] || icons.products;
};

/* ─── Status badge colors ────────────────────────────────────────────────── */
const STATUS_STYLES = {
  pending:    'bg-amber-100 text-amber-700',
  processing: 'bg-blue-100 text-blue-700',
  shipped:    'bg-purple-100 text-purple-700',
  delivered:  'bg-[#00FF88]/15 text-[#00A85A]',
  cancelled:  'bg-red-100 text-red-600',
};

/* ─── Stat card icon type map ────────────────────────────────────────────── */
const ICON_MAP = {
  Products:    'products',
  Orders:      'orders',
  Users:       'users',
  Revenue:     'revenue',
  'Avg Rating':'rating',
};

/* ─── Dashboard component ────────────────────────────────────────────────── */
const Dashboard = ({ stats = [], orders = [], products = [] }) => {
  const recentOrders = [...orders]
    .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
    .slice(0, 6);

  const topProducts = [...products]
    .sort((a, b) => (b.soldCount || 0) - (a.soldCount || 0))
    .slice(0, 5);

  const pendingCount   = orders.filter((o) => o.orderStatus === 'pending').length;
  const deliveredCount = orders.filter((o) => o.orderStatus === 'delivered').length;

  return (
    <div className="space-y-6">
      {/* ── Stat cards ─────────────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
        {stats.map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.055, duration: 0.28 }}
            className="group rounded-[24px] border border-black/5 bg-white p-5 shadow-sm transition hover:shadow-md hover:-translate-y-0.5"
          >
            <div className="flex items-start justify-between gap-2">
              <p className="text-xs font-semibold uppercase tracking-[0.2em] text-black/40">
                {stat.label}
              </p>
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-black/[0.04] text-black/60 transition group-hover:bg-black group-hover:text-white">
                <StatIcon type={ICON_MAP[stat.label] || 'products'} />
              </span>
            </div>
            <div className="mt-3 text-3xl font-semibold text-black">{stat.value}</div>
            <p className="mt-2 flex items-center gap-1.5 text-xs text-black/45">
              {stat.trend === 'up' && (
                <span className="inline-flex items-center gap-1 rounded-full bg-[#00FF88]/15 px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-[#00A85A]">
                  <svg width="8" height="8" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round">
                    <path d="M18 15l-6-6-6 6" />
                  </svg>
                  Active
                </span>
              )}
              {stat.helper}
            </p>
          </motion.div>
        ))}
      </div>

      {/* ── Quick metrics row ──────────────────────────────────────────── */}
      <div className="grid gap-4 sm:grid-cols-3">
        {[
          { label: 'Pending orders',   value: pendingCount,   color: 'text-amber-600',  bg: 'bg-amber-50',  border: 'border-amber-100' },
          { label: 'Delivered orders', value: deliveredCount, color: 'text-[#00A85A]',  bg: 'bg-[#00FF88]/8', border: 'border-[#00FF88]/20' },
          { label: 'Active products',  value: products.filter((p) => p.isActive).length, color: 'text-blue-600', bg: 'bg-blue-50', border: 'border-blue-100' },
        ].map((m) => (
          <div key={m.label} className={`flex items-center justify-between rounded-[20px] border ${m.border} ${m.bg} px-5 py-4`}>
            <p className="text-sm font-medium text-black/60">{m.label}</p>
            <p className={`text-2xl font-semibold ${m.color}`}>{m.value}</p>
          </div>
        ))}
      </div>

      {/* ── Two-column: recent orders + top products ───────────────────── */}
      <div className="grid gap-6 xl:grid-cols-[1.3fr_0.7fr]">
        {/* Recent orders */}
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="mb-5 flex items-center justify-between gap-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
                Live activity
              </p>
              <h3 className="mt-1 text-xl font-semibold text-black">Recent orders</h3>
            </div>
            <span className="flex items-center gap-1.5 rounded-full bg-[#00FF88]/12 px-3 py-1.5 text-xs font-semibold text-[#00A85A]">
              <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF88]" />
              Live
            </span>
          </div>

          {recentOrders.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black/20">
                <path d="M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z" />
                <line x1="3" y1="6" x2="21" y2="6" />
                <path d="M16 10a4 4 0 0 1-8 0" />
              </svg>
              <p className="text-sm text-black/40">No orders yet.</p>
            </div>
          ) : (
            <div className="space-y-2.5">
              {recentOrders.map((order) => (
                <div
                  key={order._id}
                  className="flex items-center justify-between gap-4 rounded-2xl border border-black/5 bg-black/[0.015] px-4 py-3 transition hover:bg-black/[0.03]"
                >
                  <div className="min-w-0">
                    <p className="truncate text-sm font-semibold text-black">
                      #{order._id.slice(-6).toUpperCase()}
                    </p>
                    <p className="mt-0.5 truncate text-xs text-black/45">
                      {order.userId?.email || order.userId?.firstName || 'Customer'} ·{' '}
                      {order.items?.length || 0} item{order.items?.length !== 1 ? 's' : ''} ·{' '}
                      {formatDate(order.createdAt)}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-3">
                    <span className="text-sm font-semibold text-black">
                      {formatPrice(order.totalPrice)}
                    </span>
                    <span
                      className={`rounded-full px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.12em] ${
                        STATUS_STYLES[order.orderStatus] || 'bg-black/5 text-black/50'
                      }`}
                    >
                      {order.orderStatus}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top products */}
        <div className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm">
          <div className="mb-5">
            <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/40">
              Catalog
            </p>
            <h3 className="mt-1 text-xl font-semibold text-black">Top products</h3>
          </div>

          {topProducts.length === 0 ? (
            <div className="flex flex-col items-center gap-3 py-8 text-center">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" className="text-black/20">
                <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
              </svg>
              <p className="text-sm text-black/40">No products yet.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {topProducts.map((product, i) => (
                <div
                  key={product._id}
                  className="flex items-center gap-3 rounded-2xl border border-black/5 bg-black/[0.015] px-3 py-2.5 transition hover:bg-black/[0.03]"
                >
                  <span className="w-5 shrink-0 text-center text-xs font-bold text-black/25">
                    {i + 1}
                  </span>
                  <div className="h-10 w-10 shrink-0 overflow-hidden rounded-xl bg-black/5">
                    <img
                      src={product.images?.[0]?.url || 'https://via.placeholder.com/80x80?text=I'}
                      alt={product.name}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/80x80?text=I'; }}
                    />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-sm font-semibold text-black">{product.name}</p>
                    <p className="text-xs text-black/40">
                      {product.soldCount || 0} sold
                    </p>
                  </div>
                  <span className="shrink-0 text-sm font-semibold text-black">
                    {formatPrice(product.finalPrice ?? product.price)}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
