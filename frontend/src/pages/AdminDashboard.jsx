import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { orderService } from '../services/orderService';
import { userService } from '../services/userService';
import Dashboard from '../components/admin/Dashboard';
import ProductForm from '../components/admin/ProductForm';
import OrderManagement from '../components/admin/OrderManagement';
import UserManagement from '../components/admin/UserManagement';
import { APP_CONSTANTS } from '../utils/constants';
import { useNotifications } from '../context/NotificationContext';
import { formatPrice, formatDate } from '../utils/formatters';

const POLL_INTERVAL_MS = 30_000;
const TABS = ['overview', 'products', 'orders', 'users'];

const AdminDashboard = () => {
  const [stats, setStats]                     = useState([]);
  const [orders, setOrders]                   = useState([]);
  const [products, setProducts]               = useState([]);
  const [users, setUsers]                     = useState([]);
  const [loading, setLoading]                 = useState(true);
  const [dataError, setDataError]             = useState('');
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [tab, setTab]                         = useState('overview');
  const [lastRefreshed, setLastRefreshed]     = useState(null);
  const [liveIndicator, setLiveIndicator]     = useState(false);
  const [notifOpen, setNotifOpen]             = useState(false);
  const [productSearch, setProductSearch]     = useState('');
  const [productCategoryFilter, setProductCategoryFilter] = useState('');
  const pollRef = useRef(null);
  const notifRef = useRef(null);
  const { syncOrderCount, markAllSeen, unreadCount } = useNotifications();

  // Close notification panel on outside click
  useEffect(() => {
    const handler = (e) => {
      if (notifRef.current && !notifRef.current.contains(e.target)) {
        setNotifOpen(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ─── Data fetch ─────────────────────────────────────────────────────────────
  const refresh = useCallback(async (silent = false) => {
    if (!silent) setLoading(true);
    setDataError('');

    const [productRes, orderRes, userRes] = await Promise.allSettled([
      productService.getAllProducts({ limit: 200 }),
      orderService.getAllOrders(),
      userService.getUsers({ limit: 200 }),
    ]);

    const failed = [productRes, orderRes, userRes].filter((r) => r.status === 'rejected').length;
    if (failed === 3) {
      setDataError('Unable to load admin data. Check backend connection and permissions.');
    }

    const productList = productRes.status === 'fulfilled' ? (productRes.value.products || []) : [];
    const orderList   = orderRes.status  === 'fulfilled' ? (orderRes.value.orders   || []) : [];
    const userList    = userRes.status   === 'fulfilled' ? (userRes.value.users     || []) : [];

    setProducts(productList);
    setOrders(orderList);
    setUsers(userList);
    syncOrderCount(orderList.length);

    const revenue       = orderList.reduce((s, o) => s + (o.totalPrice || 0), 0);
    const pendingOrders = orderList.filter((o) => o.orderStatus === 'pending').length;
    const avgRating     = productList.length
      ? (productList.reduce((s, p) => s + (p.rating || 0), 0) / productList.length).toFixed(1)
      : '—';

    setStats([
      { label: 'Products',   value: productList.length,       helper: 'Catalog items',          icon: '📦', trend: null },
      { label: 'Orders',     value: orderList.length,         helper: `${pendingOrders} pending`, icon: '🛒', trend: pendingOrders > 0 ? 'up' : null },
      { label: 'Users',      value: userList.length,          helper: 'Registered accounts',    icon: '👤', trend: null },
      { label: 'Revenue',    value: `$${revenue.toFixed(0)}`, helper: 'Gross sales total',      icon: '💰', trend: revenue > 0 ? 'up' : null },
      { label: 'Avg Rating', value: avgRating,                helper: 'Product sentiment',      icon: '⭐', trend: null },
    ]);

    setLastRefreshed(new Date());
    setLiveIndicator(true);
    setTimeout(() => setLiveIndicator(false), 1200);
    if (!silent) setLoading(false);
  }, [syncOrderCount]);

  useEffect(() => { refresh(false); }, [refresh]);

  useEffect(() => {
    pollRef.current = setInterval(() => refresh(true), POLL_INTERVAL_MS);
    return () => clearInterval(pollRef.current);
  }, [refresh]);

  // ─── Filtered products for the products tab ──────────────────────────────
  const filteredProducts = useMemo(() => {
    let list = [...products];
    if (productSearch.trim()) {
      const q = productSearch.toLowerCase();
      list = list.filter(
        (p) =>
          p.name?.toLowerCase().includes(q) ||
          p.brand?.toLowerCase().includes(q) ||
          p.description?.toLowerCase().includes(q)
      );
    }
    if (productCategoryFilter) {
      list = list.filter((p) => p.category === productCategoryFilter);
    }
    return list;
  }, [products, productSearch, productCategoryFilter]);

  // ─── Recent orders for notification panel ───────────────────────────────
  const recentOrders = useMemo(
    () =>
      [...orders]
        .sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt))
        .slice(0, 8),
    [orders]
  );

  // ─── Product actions ─────────────────────────────────────────────────────
  const saveProduct = async (payload) => {
    try {
      if (selectedProduct?._id) {
        await productService.updateProduct(selectedProduct._id, payload);
        toast.success('Product updated');
      } else {
        await productService.createProduct(payload);
        toast.success('Product created');
      }
      setSelectedProduct(null);
      await refresh(true);
    } catch (err) {
      toast.error(err?.message || 'Failed to save product');
    }
  };

  const softDeleteProduct = async (id) => {
    try {
      await productService.updateProduct(id, { isActive: false });
      toast.success('Product hidden from catalog');
      await refresh(true);
    } catch { toast.error('Failed to hide product'); }
  };

  const hardDeleteProduct = async (id) => {
    if (!window.confirm('Permanently delete this product? This cannot be undone.')) return;
    try {
      await productService.deleteProduct(id);
      toast.success('Product deleted');
      await refresh(true);
    } catch { toast.error('Failed to delete product'); }
  };

  const restoreProduct = async (id) => {
    try {
      await productService.updateProduct(id, { isActive: true });
      toast.success('Product restored');
      await refresh(true);
    } catch { toast.error('Failed to restore product'); }
  };

  // ─── Order actions ───────────────────────────────────────────────────────
  const updateStatus = async (orderId, status) => {
    try {
      await orderService.updateOrderStatus(orderId, status);
      toast.success(`Order marked as ${status}`);
      await refresh(true);
    } catch { toast.error('Failed to update order status'); }
  };

  // ─── User actions ────────────────────────────────────────────────────────
  const updateUser = async (id, payload) => { await userService.updateUser(id, payload); await refresh(true); };
  const createUser = async (payload)      => { await userService.createUser(payload);    await refresh(true); };
  const deleteUser = async (id)           => { await userService.deleteUser(id); toast.success('User deleted'); await refresh(true); };

  // ─── Product editor initial value ────────────────────────────────────────
  const productEditorValue = selectedProduct
    ? {
        name:        selectedProduct.name        || '',
        description: selectedProduct.description || '',
        price:       selectedProduct.price       || '',
        discount:    selectedProduct.discount    || 0,
        brand:       selectedProduct.brand       || 'I.Shoes',
        category:    selectedProduct.category    || APP_CONSTANTS.CATEGORIES[0],
        collection:  selectedProduct.collection  || APP_CONSTANTS.COLLECTIONS[2].name,
        gender:      selectedProduct.gender      || 'unisex',
        sizes:       Array.isArray(selectedProduct.sizes)  ? selectedProduct.sizes.join(',')                     : '7,8,9,10',
        colors:      Array.isArray(selectedProduct.colors) ? selectedProduct.colors.join(',')                    : 'Black,White',
        stock:       selectedProduct.stock       || 0,
        images:      Array.isArray(selectedProduct.images) ? selectedProduct.images.map((i) => i.url).join('\n') : '',
      }
    : undefined;

  return (
    <div className="space-y-6 pb-12">
      {/* ── Dashboard header ──────────────────────────────────────────────── */}
      <div className="flex flex-wrap items-center justify-between gap-4 rounded-[28px] border border-black/5 bg-white/90 p-5 shadow-sm backdrop-blur">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.35em] text-black/40">
            Admin control center
          </p>
          <h1 className="mt-1.5 text-3xl font-semibold text-black">Dashboard</h1>
          {lastRefreshed && (
            <p className="mt-1 flex items-center gap-2 text-xs text-black/35">
              <span
                className={`inline-block h-2 w-2 rounded-full transition-colors duration-500 ${
                  liveIndicator ? 'bg-[#00FF88]' : 'bg-black/20'
                }`}
              />
              Updated {lastRefreshed.toLocaleTimeString()}
              <button
                type="button"
                onClick={() => refresh(false)}
                className="ml-1 rounded-full border border-black/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-[0.15em] text-black/45 hover:bg-black/5 transition"
              >
                Refresh
              </button>
            </p>
          )}
        </div>

        <div className="flex items-center gap-3">
          {/* ── Notification bell ─────────────────────────────────────── */}
          <div className="relative" ref={notifRef}>
            <button
              type="button"
              onClick={() => {
                setNotifOpen((v) => !v);
                if (!notifOpen) markAllSeen();
              }}
              className="relative flex h-10 w-10 items-center justify-center rounded-full border border-black/10 bg-white text-black shadow-sm transition hover:bg-black/5"
              aria-label="Notifications"
            >
              {/* Bell icon */}
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                <path d="M13.73 21a2 2 0 0 1-3.46 0" />
              </svg>
              {unreadCount > 0 && (
                <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white">
                  {unreadCount > 9 ? '9+' : unreadCount}
                </span>
              )}
            </button>

            {/* Notification dropdown */}
            <AnimatePresence>
              {notifOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.96 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 4, scale: 0.97 }}
                  transition={{ duration: 0.18 }}
                  className="absolute right-0 top-12 z-50 w-80 overflow-hidden rounded-[24px] border border-black/8 bg-white shadow-[0_24px_60px_rgba(11,11,11,0.14)]"
                >
                  <div className="flex items-center justify-between border-b border-black/5 px-4 py-3">
                    <p className="text-sm font-semibold text-black">Recent orders</p>
                    <span className="rounded-full bg-black/5 px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.15em] text-black/50">
                      {orders.length} total
                    </span>
                  </div>

                  <div className="max-h-72 overflow-y-auto">
                    {recentOrders.length === 0 ? (
                      <p className="px-4 py-6 text-center text-sm text-black/40">
                        No orders yet
                      </p>
                    ) : (
                      recentOrders.map((order, i) => (
                        <div
                          key={order._id}
                          className={`flex items-start gap-3 px-4 py-3 transition hover:bg-black/[0.02] ${
                            i < unreadCount ? 'bg-[#00FF88]/5' : ''
                          }`}
                        >
                          <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-black/5 text-sm">
                            🛒
                          </div>
                          <div className="min-w-0 flex-1">
                            <p className="text-sm font-semibold text-black">
                              Order #{order._id.slice(-6).toUpperCase()}
                            </p>
                            <p className="mt-0.5 truncate text-xs text-black/45">
                              {order.userId?.email || order.userId?.firstName || 'Customer'} ·{' '}
                              {formatPrice(order.totalPrice)}
                            </p>
                            <p className="mt-0.5 text-[10px] text-black/30">
                              {formatDate(order.createdAt)}
                            </p>
                          </div>
                          <span
                            className={`mt-1 shrink-0 rounded-full px-2 py-0.5 text-[10px] font-bold uppercase ${
                              order.orderStatus === 'pending'
                                ? 'bg-amber-100 text-amber-700'
                                : order.orderStatus === 'delivered'
                                ? 'bg-[#00FF88]/15 text-[#00A85A]'
                                : 'bg-black/5 text-black/50'
                            }`}
                          >
                            {order.orderStatus}
                          </span>
                        </div>
                      ))
                    )}
                  </div>

                  <div className="border-t border-black/5 px-4 py-3">
                    <button
                      type="button"
                      onClick={() => { setTab('orders'); setNotifOpen(false); markAllSeen(); }}
                      className="w-full rounded-full bg-black py-2 text-xs font-semibold text-white transition hover:bg-black/80"
                    >
                      View all orders
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* ── Tab switcher ──────────────────────────────────────────── */}
          <div className="grid grid-cols-2 gap-1.5 rounded-2xl border border-black/10 bg-white p-1 sm:grid-cols-4 sm:rounded-full">
            {TABS.map((t) => (
              <button
                key={t}
                onClick={() => {
                  setTab(t);
                  if (t === 'orders') markAllSeen();
                }}
                className={`relative rounded-xl px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] transition sm:rounded-full ${
                  tab === t ? 'bg-black text-white' : 'text-black/50 hover:bg-black/5'
                }`}
              >
                {t}
                {t === 'orders' && unreadCount > 0 && (
                  <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* ── Error banner ──────────────────────────────────────────────────── */}
      {dataError && (
        <div className="rounded-2xl border border-red-200 bg-red-50 px-4 py-3 text-sm font-medium text-red-700">
          {dataError}
        </div>
      )}

      {/* ── Tab content ───────────────────────────────────────────────────── */}
      <AnimatePresence mode="wait">
        <motion.div
          key={tab}
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.2 }}
        >
          {/* Overview */}
          {tab === 'overview' && (
            loading
              ? <LoadingPlaceholder />
              : <Dashboard stats={stats} orders={orders} products={products} />
          )}

          {/* Products */}
          {tab === 'products' && (
            <div className="space-y-5">
              {/* Edit mode banner */}
              {selectedProduct && (
                <div className="flex items-center justify-between rounded-2xl border border-[#00FF88]/30 bg-[#00FF88]/8 px-4 py-3">
                  <p className="text-sm font-semibold text-black">
                    Editing:{' '}
                    <span className="text-[#00A85A]">{selectedProduct.name}</span>
                  </p>
                  <button
                    type="button"
                    onClick={() => setSelectedProduct(null)}
                    className="rounded-full border border-black/10 px-3 py-1.5 text-xs font-semibold text-black hover:bg-black/5 transition"
                  >
                    Cancel edit
                  </button>
                </div>
              )}

              <ProductForm
                initialValue={productEditorValue}
                onSubmit={saveProduct}
                submitLabel={selectedProduct ? 'Update product' : 'Add product'}
              />

              {/* Search + filter bar */}
              <div className="flex flex-wrap items-center gap-3 rounded-[24px] border border-black/5 bg-white p-4 shadow-sm">
                <div className="relative flex-1 min-w-[200px]">
                  <svg
                    className="absolute left-3.5 top-1/2 -translate-y-1/2 text-black/30"
                    width="15" height="15" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2.5" strokeLinecap="round"
                  >
                    <circle cx="11" cy="11" r="8" />
                    <path d="m21 21-4.35-4.35" />
                  </svg>
                  <input
                    type="text"
                    placeholder="Search products…"
                    value={productSearch}
                    onChange={(e) => setProductSearch(e.target.value)}
                    className="w-full rounded-full border border-black/10 bg-black/[0.02] py-2.5 pl-9 pr-4 text-sm text-black placeholder:text-black/30 focus:border-black/20 focus:outline-none focus:ring-2 focus:ring-[#00FF88]/20 transition"
                  />
                </div>

                <select
                  value={productCategoryFilter}
                  onChange={(e) => setProductCategoryFilter(e.target.value)}
                  className="rounded-full border border-black/10 bg-white px-4 py-2.5 text-sm font-medium text-black focus:outline-none focus:ring-2 focus:ring-[#00FF88]/20 transition"
                >
                  <option value="">All categories</option>
                  {APP_CONSTANTS.CATEGORIES.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>

                <div className="text-xs font-semibold text-black/40">
                  {filteredProducts.length} of {products.length} products
                </div>

                {(productSearch || productCategoryFilter) && (
                  <button
                    type="button"
                    onClick={() => { setProductSearch(''); setProductCategoryFilter(''); }}
                    className="rounded-full border border-black/10 px-3 py-2 text-xs font-semibold text-black/50 hover:bg-black/5 transition"
                  >
                    Clear
                  </button>
                )}
              </div>

              {filteredProducts.length === 0 && !loading && (
                <div className="rounded-[24px] border border-dashed border-black/15 p-8 text-center text-black/50">
                  {products.length === 0
                    ? 'No products yet. Add your first product above.'
                    : 'No products match your search.'}
                </div>
              )}

              <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                {filteredProducts.map((product) => (
                  <ProductAdminCard
                    key={product._id}
                    product={product}
                    onEdit={() => {
                      setSelectedProduct(product);
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    onSoftDelete={() => softDeleteProduct(product._id)}
                    onHardDelete={() => hardDeleteProduct(product._id)}
                    onRestore={() => restoreProduct(product._id)}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Orders */}
          {tab === 'orders' && (
            loading
              ? <LoadingPlaceholder />
              : <OrderManagement orders={orders} onUpdateStatus={updateStatus} />
          )}

          {/* Users */}
          {tab === 'users' && (
            loading
              ? <LoadingPlaceholder />
              : (
                <UserManagement
                  users={users}
                  onCreateUser={createUser}
                  onUpdateUser={updateUser}
                  onDeleteUser={deleteUser}
                />
              )
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

// ─── Product admin card ──────────────────────────────────────────────────────
const ProductAdminCard = ({ product, onEdit, onSoftDelete, onHardDelete, onRestore }) => (
  <article
    className={`rounded-[28px] border bg-white p-5 shadow-sm transition ${
      product.isActive ? 'border-black/5' : 'border-dashed border-black/15 opacity-60'
    }`}
  >
    <div className="flex gap-4">
      <div className="h-20 w-20 shrink-0 overflow-hidden rounded-2xl bg-black/5">
        <img
          src={product.images?.[0]?.url || 'https://via.placeholder.com/300x300?text=I'}
          alt={product.name}
          className="h-full w-full object-cover"
          onError={(e) => { e.currentTarget.onerror = null; e.currentTarget.src = 'https://via.placeholder.com/300x300?text=I'; }}
        />
      </div>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <p className="text-xs font-semibold uppercase tracking-[0.16em] text-black/38">
            {product.collection}
          </p>
          <p className="shrink-0 text-sm font-semibold text-black">
            ${product.finalPrice ?? product.price}
          </p>
        </div>
        <h3 className="mt-1 line-clamp-1 text-base font-semibold text-black">
          {product.name}
        </h3>
        <p className="mt-0.5 line-clamp-2 text-xs text-black/50">
          {product.description}
        </p>
      </div>
    </div>

    <div className="mt-3 flex flex-wrap gap-2 text-[11px] uppercase tracking-[0.14em] text-black/40">
      <span className="rounded-full bg-black/5 px-3 py-1.5">{product.category}</span>
      <span className="rounded-full bg-black/5 px-3 py-1.5">
        Stock {product.stock}
      </span>
      <span
        className={`rounded-full px-3 py-1.5 ${
          product.isActive
            ? 'bg-[#00FF88]/15 text-[#00A85A]'
            : 'bg-red-50 text-red-500'
        }`}
      >
        {product.isActive ? 'Active' : 'Hidden'}
      </span>
      {product.discount > 0 && (
        <span className="rounded-full bg-amber-50 px-3 py-1.5 text-amber-700">
          -{product.discount}%
        </span>
      )}
    </div>

    <div className="mt-4 flex flex-wrap items-center justify-end gap-2">
      <button
        type="button"
        onClick={onEdit}
        className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black hover:bg-black/5 transition"
      >
        Edit
      </button>
      {product.isActive ? (
        <button
          type="button"
          onClick={onSoftDelete}
          className="rounded-full border border-amber-200 px-4 py-2 text-xs font-semibold text-amber-700 hover:bg-amber-50 transition"
        >
          Hide
        </button>
      ) : (
        <button
          type="button"
          onClick={onRestore}
          className="rounded-full border border-[#00FF88]/40 px-4 py-2 text-xs font-semibold text-[#00A85A] hover:bg-[#00FF88]/10 transition"
        >
          Restore
        </button>
      )}
      <button
        type="button"
        onClick={onHardDelete}
        className="rounded-full border border-red-200 px-4 py-2 text-xs font-semibold text-red-600 hover:bg-red-50 transition"
      >
        Delete
      </button>
    </div>
  </article>
);

const LoadingPlaceholder = () => (
  <div className="rounded-[28px] border border-black/5 bg-white p-8 text-sm text-black/50">
    <div className="flex items-center gap-3">
      <span className="h-4 w-4 animate-spin rounded-full border-2 border-black/20 border-t-black/60" />
      Loading data…
    </div>
  </div>
);

export default AdminDashboard;
