import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { useAuth } from '../../hooks/useAuth';

const Footer = () => {
  const { isAuthenticated, user } = useAuth();
  return (
    <footer className="mt-20 border-t border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f2_100%)]">
      <div className="mx-auto max-w-[1440px] px-4 py-14 md:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.25 }}
          transition={{ duration: 0.6 }}
          className="glass-panel rounded-[32px] p-6 md:p-8"
        >
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.75fr_0.75fr_0.9fr]">
            <div>
              <h3 className="text-3xl font-semibold text-black">I.<span className="text-[#00A85A]">Shoes</span></h3>
              <p className="mt-4 max-w-sm text-sm leading-7 text-black/55">Premium shoes e-commerce built for performance, polished UI, and a commercial-ready customer journey.</p>
              <div className="mt-6 flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/45">
                <span className="rounded-full bg-black/5 px-3 py-2 transition hover:bg-black/10">Fast checkout</span>
                <span className="rounded-full bg-black/5 px-3 py-2 transition hover:bg-black/10">Secure auth</span>
                <span className="rounded-full bg-black/5 px-3 py-2 transition hover:bg-black/10">Premium motion</span>
              </div>
            </div>

            <div>
              <p className="section-kicker">Explore</p>
              <div className="mt-4 space-y-3 text-sm text-black/65">
                <Link to="/products" className="block transition hover:text-black">Products</Link>
                {isAuthenticated && (
                  <Link to="/orders" className="block transition hover:text-black">Orders</Link>
                )}
                <Link to="/wishlist" className="block transition hover:text-black">Wishlist</Link>
                {isAuthenticated && user?.role === 'admin' && (
                  <Link to="/admin" className="block transition hover:text-black">Admin</Link>
                )}
              </div>
            </div>

            <div>
              <p className="section-kicker">Collections</p>
              <div className="mt-4 space-y-3 text-sm text-black/65">
                <p>Summer Collection</p>
                <p>Winter Collection</p>
                <p>New Arrivals</p>
                <p>Best Sellers</p>
              </div>
            </div>

            <div>
              <p className="section-kicker">Contact</p>
              <div className="mt-4 space-y-3 text-sm text-black/65">
                <p>support@ishoes.com</p>
                <p>Mon - Sat</p>
                <p>Worldwide shipping</p>
              </div>
            </div>
          </div>
          <div className="mt-10 grid gap-6 border-t border-black/5 pt-6 lg:grid-cols-[0.8fr_1.2fr]">
            <div>
              <p className="section-kicker">Newsletter</p>
              <h4 className="mt-3 text-2xl font-semibold text-black">Get early drops and private releases.</h4>
            </div>
            <div className="flex flex-col gap-3 sm:flex-row">
              <input
                type="email"
                placeholder="Email address"
                className="min-w-0 flex-1 rounded-full border border-black/10 bg-white/90 px-5 py-4 text-sm outline-none transition focus:border-[#00FF88]"
              />
              <motion.button
                type="button"
                whileTap={{ scale: 0.96 }}
                data-magnetic
                data-magnetic-strength="0.14"
                className="rounded-full bg-black px-6 py-4 text-sm font-semibold text-white"
              >
                Subscribe
              </motion.button>
            </div>
          </div>

          <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-black/5 pt-5 text-sm text-black/50">
            <p>Crafted for a premium commerce experience.</p>
            <div className="flex flex-wrap gap-4 font-medium text-black/70">
              {['Instagram', 'X', 'Pinterest', 'Behance'].map((label) => (
                <a key={label} href="#" onClick={(event) => event.preventDefault()} className="transition hover:text-black">
                  {label}
                </a>
              ))}
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
