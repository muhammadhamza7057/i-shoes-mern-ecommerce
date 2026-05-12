import React, { useCallback, useEffect, useRef, useState } from 'react';
import { AnimatePresence, motion, useMotionValueEvent, useScroll } from 'framer-motion';
import { Link, NavLink, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useCart } from '../../hooks/useCart';
import { useWishlist } from '../../hooks/useWishlist';
import { useNotifications } from '../../context/NotificationContext';
import { APP_CONSTANTS } from '../../utils/constants';

/* ─── SVG icon helpers (no external deps needed) ─────────────────────────── */
const Icon = ({ d, size = 18, strokeWidth = 1.8, className = '' }) => (
  <svg
    width={size}
    height={size}
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth={strokeWidth}
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
    aria-hidden="true"
  >
    {Array.isArray(d) ? d.map((path, i) => <path key={i} d={path} />) : <path d={d} />}
  </svg>
);

const SearchIcon  = () => <Icon d="M21 21l-4.35-4.35M17 11A6 6 0 1 1 5 11a6 6 0 0 1 12 0z" />;
const CartIcon    = () => <Icon d={['M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z', 'M3 6h18', 'M16 10a4 4 0 0 1-8 0']} />;
const HeartIcon   = () => <Icon d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z" />;
const UserIcon    = () => <Icon d={['M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2', 'M12 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z']} />;
const BellIcon    = () => <Icon d={['M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9', 'M13.73 21a2 2 0 0 1-3.46 0']} />;
const ChevronDown = () => <Icon d="M6 9l6 6 6-6" size={14} strokeWidth={2} />;
const XIcon       = () => <Icon d="M18 6 6 18M6 6l12 12" size={16} strokeWidth={2} />;

/* ─── Category dropdown data ─────────────────────────────────────────────── */
const CATEGORY_LINKS = APP_CONSTANTS.CATEGORIES.map((cat) => ({
  label: cat,
  to: `/products?category=${encodeURIComponent(cat)}`,
}));

/* ─── Navbar ─────────────────────────────────────────────────────────────── */
const Navbar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  const { isAuthenticated, user, logout } = useAuth();
  const { itemCount } = useCart();
  const { wishlistItems } = useWishlist();
  const { unreadCount } = useNotifications();

  /* scroll-aware hide/show */
  const { scrollY } = useScroll();
  const [hidden, setHidden]     = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const lastY = useRef(0);

  useMotionValueEvent(scrollY, 'change', (y) => {
    setScrolled(y > 24);
    if (y > lastY.current && y > 80) {
      setHidden(true);
    } else {
      setHidden(false);
    }
    lastY.current = y;
  });

  /* mobile menu */
  const [mobileOpen, setMobileOpen] = useState(false);
  useEffect(() => { setMobileOpen(false); }, [location.pathname]);

  /* search */
  const [searchOpen, setSearchOpen]   = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const searchInputRef = useRef(null);

  useEffect(() => {
    if (searchOpen) setTimeout(() => searchInputRef.current?.focus(), 80);
  }, [searchOpen]);

  const handleSearch = (e) => {
    e.preventDefault();
    if (!searchQuery.trim()) return;
    navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
    setSearchOpen(false);
    setSearchQuery('');
  };

  /* category dropdown */
  const [catOpen, setCatOpen] = useState(false);
  const catRef = useRef(null);
  useEffect(() => {
    const handler = (e) => {
      if (catRef.current && !catRef.current.contains(e.target)) setCatOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleLogout = useCallback(() => {
    logout();
    navigate('/');
  }, [logout, navigate]);

  /* nav link style */
  const navLinkClass = ({ isActive }) =>
    `relative px-3 py-1.5 text-sm font-semibold rounded-full transition-colors duration-200 ${
      isActive ? 'text-black' : 'text-black/55 hover:text-black'
    }`;

  const ActiveBar = () => (
    <motion.span
      layoutId="nav-active-bar"
      className="absolute -bottom-1 left-1/2 h-[3px] w-4 -translate-x-1/2 rounded-full bg-[#00FF88]"
      transition={{ type: 'spring', stiffness: 380, damping: 30 }}
    />
  );

  /* glass style */
  const navBg = isAdminRoute
    ? 'border-black/12 bg-white/96 shadow-[0_8px_32px_rgba(11,11,11,0.10)] backdrop-blur-2xl'
    : scrolled
    ? 'border-black/10 bg-white/82 shadow-[0_8px_28px_rgba(11,11,11,0.08)] backdrop-blur-2xl'
    : 'border-white/30 bg-white/50 shadow-[0_4px_20px_rgba(11,11,11,0.04)] backdrop-blur-xl';

  return (
    <motion.header
      className="sticky top-0 z-50"
      animate={{ y: hidden ? '-110%' : '0%' }}
      transition={{ duration: 0.32, ease: [0.25, 0.46, 0.45, 0.94] }}
    >
      {/* ── Search overlay ──────────────────────────────────────────────── */}
      <AnimatePresence>
        {searchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.18 }}
            className="fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm"
            onClick={() => setSearchOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.22, ease: 'easeOut' }}
              onClick={(e) => e.stopPropagation()}
              className="mx-auto mt-24 max-w-2xl px-4"
            >
              <form
                onSubmit={handleSearch}
                className="flex items-center gap-3 rounded-[24px] border border-black/10 bg-white p-3 shadow-[0_24px_60px_rgba(11,11,11,0.18)]"
              >
                <SearchIcon />
                <input
                  ref={searchInputRef}
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shoes, brands, collections…"
                  className="flex-1 bg-transparent text-base text-black placeholder:text-black/35 focus:outline-none"
                />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="text-black/40 hover:text-black transition"
                  >
                    <XIcon />
                  </button>
                )}
                <button
                  type="submit"
                  className="rounded-full bg-black px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-black/80"
                >
                  Search
                </button>
              </form>
              <p className="mt-3 text-center text-xs text-white/60">
                Press <kbd className="rounded bg-white/20 px-1.5 py-0.5 font-mono">Esc</kbd> to close
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ── Main navbar ─────────────────────────────────────────────────── */}
      <motion.div
        initial={{ y: -24, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
        className="mx-auto mt-3 max-w-[1440px] px-4 md:px-6 lg:px-8"
      >
        <nav className={`overflow-visible rounded-[28px] border px-4 py-3 transition-all duration-300 md:px-5 ${navBg}`}>
          {/* Green accent line */}
          <div className="absolute inset-x-0 top-0 h-[1px] rounded-t-[28px] bg-gradient-to-r from-transparent via-[#00FF88]/60 to-transparent" />

          {/* Admin banner */}
          {isAdminRoute && (
            <div className="mb-3 hidden items-center justify-between rounded-2xl border border-black/8 bg-black/[0.025] px-3 py-2 lg:flex">
              <div className="flex items-center gap-2">
                <span className="h-1.5 w-1.5 animate-pulse rounded-full bg-[#00FF88]" />
                <p className="text-[10px] font-bold uppercase tracking-[0.3em] text-black/50">
                  Admin mode
                </p>
              </div>
              <p className="text-xs text-black/40">
                Manage products, orders, and users
              </p>
            </div>
          )}

          <div className="flex items-center gap-3 lg:grid lg:grid-cols-[auto_1fr_auto]">
            {/* ── Logo ──────────────────────────────────────────────────── */}
            <Link
              to="/"
              className="flex shrink-0 items-center gap-2.5 no-focus-ring"
              aria-label="I.Shoes home"
            >
              <span className="grid h-10 w-10 place-items-center rounded-xl bg-black text-sm font-bold text-white shadow-[0_8px_24px_rgba(11,11,11,0.22)]">
                I
              </span>
              <span className="text-xl font-semibold tracking-tight text-black">
                I.<span className="text-[#00A85A]">Shoes</span>
              </span>
            </Link>

            {/* ── Desktop nav ───────────────────────────────────────────── */}
            <div className="hidden items-center justify-center gap-1 lg:flex">
              {/* Products */}
              <NavLink to="/products" className={navLinkClass} end>
                {({ isActive }) => (
                  <>
                    Products
                    {isActive && <ActiveBar />}
                  </>
                )}
              </NavLink>

              {/* Categories dropdown */}
              <div className="relative" ref={catRef}>
                <button
                  type="button"
                  onClick={() => setCatOpen((v) => !v)}
                  className="flex items-center gap-1 rounded-full px-3 py-1.5 text-sm font-semibold text-black/55 transition hover:text-black"
                >
                  Categories
                  <motion.span
                    animate={{ rotate: catOpen ? 180 : 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <ChevronDown />
                  </motion.span>
                </button>

                <AnimatePresence>
                  {catOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 8, scale: 0.97 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 4, scale: 0.98 }}
                      transition={{ duration: 0.18, ease: 'easeOut' }}
                      className="absolute left-1/2 top-full mt-2 w-52 -translate-x-1/2 overflow-hidden rounded-[20px] border border-black/8 bg-white shadow-[0_20px_50px_rgba(11,11,11,0.14)]"
                    >
                      <div className="p-2">
                        {CATEGORY_LINKS.map(({ label, to }) => (
                          <Link
                            key={label}
                            to={to}
                            onClick={() => setCatOpen(false)}
                            className="flex items-center gap-3 rounded-xl px-3 py-2.5 text-sm font-medium text-black/70 transition hover:bg-black/[0.04] hover:text-black"
                          >
                            <span className="h-1.5 w-1.5 rounded-full bg-[#00FF88]" />
                            {label}
                          </Link>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* Orders — auth only */}
              {isAuthenticated && (
                <NavLink to="/orders" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Orders
                      {isActive && <ActiveBar />}
                    </>
                  )}
                </NavLink>
              )}

              {/* Wishlist — auth only */}
              {isAuthenticated && (
                <NavLink to="/wishlist" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Wishlist
                      {wishlistItems.length > 0 && (
                        <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                          {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                        </span>
                      )}
                      {isActive && <ActiveBar />}
                    </>
                  )}
                </NavLink>
              )}

              {/* Admin — admin role only */}
              {isAuthenticated && user?.role === 'admin' && (
                <NavLink to="/admin" className={navLinkClass}>
                  {({ isActive }) => (
                    <>
                      Admin
                      {unreadCount > 0 && (
                        <span className="ml-1 inline-flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white">
                          {unreadCount > 9 ? '9+' : unreadCount}
                        </span>
                      )}
                      {isActive && <ActiveBar />}
                    </>
                  )}
                </NavLink>
              )}
            </div>

            {/* ── Right actions ─────────────────────────────────────────── */}
            <div className="ml-auto flex items-center gap-2">
              {/* Search button */}
              <button
                type="button"
                onClick={() => setSearchOpen(true)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/80 text-black/60 transition hover:bg-white hover:text-black"
                aria-label="Search"
              >
                <SearchIcon />
              </button>

              {/* Cart — auth only */}
              {isAuthenticated && (
                <Link
                  to="/cart"
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/80 text-black/60 transition hover:bg-white hover:text-black"
                  aria-label={`Cart, ${itemCount} items`}
                >
                  <CartIcon />
                  {itemCount > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                      {itemCount > 9 ? '9+' : itemCount}
                    </span>
                  )}
                </Link>
              )}

              {/* Wishlist icon — auth only */}
              {isAuthenticated && (
                <Link
                  to="/wishlist"
                  className="relative grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/80 text-black/60 transition hover:bg-white hover:text-black lg:hidden"
                  aria-label="Wishlist"
                >
                  <HeartIcon />
                  {wishlistItems.length > 0 && (
                    <span className="absolute -right-1 -top-1 flex h-4 w-4 items-center justify-center rounded-full bg-black text-[9px] font-bold text-white">
                      {wishlistItems.length > 9 ? '9+' : wishlistItems.length}
                    </span>
                  )}
                </Link>
              )}

              {/* Auth section */}
              {isAuthenticated ? (
                <div className="hidden items-center gap-2 rounded-full border border-black/10 bg-white/85 p-1 shadow-sm lg:flex">
                  <div className="pl-2 pr-1 text-right leading-tight">
                    <p className="text-[10px] font-semibold uppercase tracking-[0.18em] text-black/40">
                      {user?.role === 'admin' ? 'Admin' : 'Hi,'}
                    </p>
                    <p className="text-sm font-semibold text-black">
                      {user?.firstName || 'User'}
                    </p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="h-9 rounded-full bg-black px-4 text-sm font-semibold text-white transition hover:bg-black/80"
                  >
                    Logout
                  </button>
                </div>
              ) : (
                <div className="hidden items-center gap-1.5 rounded-full border border-black/10 bg-white/85 p-1 shadow-sm lg:flex">
                  <Link
                    to="/login"
                    className="rounded-full px-4 py-2 text-sm font-semibold text-black/70 transition hover:bg-black/5 hover:text-black"
                  >
                    Login
                  </Link>
                  <Link
                    to="/register"
                    className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white transition hover:bg-black/80"
                  >
                    Register
                  </Link>
                </div>
              )}

              {/* Mobile hamburger */}
              <button
                type="button"
                onClick={() => setMobileOpen((v) => !v)}
                className="grid h-9 w-9 place-items-center rounded-full border border-black/10 bg-white/90 text-black lg:hidden"
                aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
              >
                <span className="flex flex-col gap-[5px]">
                  <span
                    className={`h-[2px] w-5 rounded-full bg-black transition-all duration-300 ${
                      mobileOpen ? 'translate-y-[7px] rotate-45' : ''
                    }`}
                  />
                  <span
                    className={`h-[2px] w-5 rounded-full bg-black transition-all duration-300 ${
                      mobileOpen ? 'opacity-0 scale-x-0' : ''
                    }`}
                  />
                  <span
                    className={`h-[2px] w-5 rounded-full bg-black transition-all duration-300 ${
                      mobileOpen ? '-translate-y-[7px] -rotate-45' : ''
                    }`}
                  />
                </span>
              </button>
            </div>
          </div>

          {/* Scroll progress bar */}
          <div className="mt-3 h-[2px] overflow-hidden rounded-full bg-black/5">
            <div className="scroll-progress-bar h-full rounded-full bg-[#00FF88] transition-[width] duration-100" />
          </div>

          {/* ── Mobile menu ───────────────────────────────────────────────── */}
          <AnimatePresence>
            {mobileOpen && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                transition={{ duration: 0.28, ease: [0.22, 1, 0.36, 1] }}
                className="overflow-hidden"
              >
                <div className="mt-3 rounded-[22px] border border-black/8 bg-white/95 p-4 shadow-[0_16px_40px_rgba(11,11,11,0.08)] backdrop-blur-xl">
                  {/* Mobile search */}
                  <form onSubmit={handleSearch} className="mb-3 flex items-center gap-2 rounded-2xl border border-black/10 bg-black/[0.02] px-3 py-2.5">
                    <SearchIcon />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search products…"
                      className="flex-1 bg-transparent text-sm text-black placeholder:text-black/35 focus:outline-none"
                    />
                  </form>

                  <div className="grid gap-1">
                    {[
                      ['Products', '/products'],
                      ...(isAuthenticated ? [['Orders', '/orders']] : []),
                      ...(isAuthenticated ? [['Wishlist', '/wishlist']] : []),
                      ...(isAuthenticated && user?.role === 'admin' ? [['Admin', '/admin']] : []),
                    ].map(([label, to]) => (
                      <Link
                        key={to}
                        to={to}
                        className="rounded-xl px-4 py-3 text-sm font-semibold text-black transition hover:bg-black/5"
                      >
                        {label}
                      </Link>
                    ))}

                    {/* Category links */}
                    <div className="mt-1 border-t border-black/5 pt-2">
                      <p className="mb-1.5 px-4 text-[10px] font-bold uppercase tracking-[0.25em] text-black/35">
                        Categories
                      </p>
                      <div className="grid grid-cols-2 gap-1">
                        {CATEGORY_LINKS.map(({ label, to }) => (
                          <Link
                            key={label}
                            to={to}
                            className="rounded-xl px-3 py-2 text-sm font-medium text-black/65 transition hover:bg-black/5 hover:text-black"
                          >
                            {label}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>

                  {/* Mobile auth + cart */}
                  <div className="mt-3 grid grid-cols-2 gap-2 border-t border-black/5 pt-3">
                    {isAuthenticated && (
                      <Link
                        to="/cart"
                        className="flex items-center justify-center gap-2 rounded-2xl border border-black/10 px-4 py-3 text-sm font-semibold text-black"
                      >
                        <CartIcon />
                        Cart {itemCount > 0 ? `(${itemCount})` : ''}
                      </Link>
                    )}
                    {isAuthenticated ? (
                      <button
                        onClick={handleLogout}
                        className={`rounded-2xl bg-black px-4 py-3 text-sm font-semibold text-white ${
                          !isAuthenticated ? 'col-span-2' : ''
                        }`}
                      >
                        Logout
                      </button>
                    ) : (
                      <>
                        <Link
                          to="/login"
                          className="rounded-2xl border border-black/10 px-4 py-3 text-center text-sm font-semibold text-black"
                        >
                          Login
                        </Link>
                        <Link
                          to="/register"
                          className="rounded-2xl bg-black px-4 py-3 text-center text-sm font-semibold text-white"
                        >
                          Register
                        </Link>
                      </>
                    )}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </nav>
      </motion.div>
    </motion.header>
  );
};

export default Navbar;
