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
          <div className="grid gap-10 lg:grid-cols-[1.1fr_0.65fr_0.65fr_0.65fr_0.9fr]">
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
                <Link to="/" className="block transition hover:text-black">Home</Link>
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
              <p className="section-kicker">Company</p>
              <div className="mt-4 space-y-3 text-sm text-black/65">
                <Link to="/about" className="block transition hover:text-black">About</Link>
                <Link to="/contact" className="block transition hover:text-black">Contact Us</Link>
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

            <div id="contact">
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
            <div className="flex flex-wrap items-center gap-3">
              {/* Instagram */}
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/55 transition hover:border-black/20 hover:text-black hover:shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                  <rect x="2" y="2" width="20" height="20" rx="5" ry="5"/>
                  <circle cx="12" cy="12" r="4"/>
                  <circle cx="17.5" cy="6.5" r="0.5" fill="currentColor" stroke="none"/>
                </svg>
              </a>
              {/* X (Twitter) */}
              <a
                href="https://x.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/55 transition hover:border-black/20 hover:text-black hover:shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="15" height="15" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-4.714-6.231-5.401 6.231H2.746l7.73-8.835L2.007 2.25H8.08l4.253 5.622zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
              {/* Pinterest */}
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Pinterest"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/55 transition hover:border-black/20 hover:text-black hover:shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M12 0C5.373 0 0 5.373 0 12c0 5.084 3.163 9.426 7.627 11.174-.105-.949-.2-2.405.042-3.441.218-.937 1.407-5.965 1.407-5.965s-.359-.719-.359-1.782c0-1.668.967-2.914 2.171-2.914 1.023 0 1.518.769 1.518 1.69 0 1.029-.655 2.568-.994 3.995-.283 1.194.599 2.169 1.777 2.169 2.133 0 3.772-2.249 3.772-5.495 0-2.873-2.064-4.882-5.012-4.882-3.414 0-5.418 2.561-5.418 5.207 0 1.031.397 2.138.893 2.738a.36.36 0 0 1 .083.345l-.333 1.36c-.053.22-.174.267-.402.161-1.499-.698-2.436-2.889-2.436-4.649 0-3.785 2.75-7.262 7.929-7.262 4.163 0 7.398 2.967 7.398 6.931 0 4.136-2.607 7.464-6.227 7.464-1.216 0-2.359-.632-2.75-1.378l-.748 2.853c-.271 1.043-1.002 2.35-1.492 3.146C9.57 23.812 10.763 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0z"/>
                </svg>
              </a>
              {/* Behance */}
              <a
                href="https://behance.net"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Behance"
                className="flex h-9 w-9 items-center justify-center rounded-full border border-black/10 bg-white/80 text-black/55 transition hover:border-black/20 hover:text-black hover:shadow-sm"
              >
                <svg xmlns="http://www.w3.org/2000/svg" width="17" height="17" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
                  <path d="M7.443 5.35c.639 0 1.23.05 1.77.198.541.099.984.297 1.377.544.394.247.689.594.886 1.04.197.395.296.89.296 1.434 0 .594-.148 1.138-.394 1.583-.246.446-.689.841-1.23 1.138.739.198 1.328.594 1.721 1.138.394.545.591 1.188.591 1.98 0 .642-.148 1.187-.394 1.682-.247.445-.64.841-1.083 1.138-.443.247-.984.445-1.574.544-.59.099-1.18.148-1.77.148H0V5.35h7.443zm-.394 5.54c.492 0 .935-.099 1.279-.347.344-.198.492-.594.492-1.089 0-.297-.049-.544-.148-.741-.099-.198-.247-.347-.443-.445-.197-.099-.394-.148-.64-.198-.246-.05-.492-.05-.787-.05H3.116v2.87h3.933zm.197 5.787c.295 0 .59-.05.836-.099.246-.05.492-.148.689-.297.197-.148.345-.346.492-.544.099-.247.148-.544.148-.89 0-.693-.197-1.188-.59-1.484-.394-.297-.935-.396-1.574-.396H3.116v3.71h4.13zm10.386-9.3h6.121v1.435h-6.12V7.377zm5.974 8.262c-.344.544-.836.99-1.476 1.286-.64.297-1.328.446-2.116.446-.788 0-1.524-.148-2.164-.396-.64-.248-1.18-.643-1.623-1.089-.443-.445-.788-.989-.984-1.632-.247-.643-.345-1.336-.345-2.078 0-.742.098-1.434.345-2.028.246-.643.59-1.138 1.033-1.583.443-.396.984-.742 1.623-.99.64-.247 1.328-.346 2.115-.346.739 0 1.426.148 2.017.445.59.297 1.082.693 1.476 1.188.394.495.689 1.089.886 1.731.148.594.246 1.237.197 1.93h-6.86c0 .743.295 1.485.787 1.93.493.496 1.132.693 1.869.693.492 0 .935-.148 1.328-.395.393-.247.639-.594.836-.99h2.066l-.01-.119zM20.36 11.75c-.049-.643-.344-1.138-.787-1.534-.443-.347-.985-.544-1.574-.544-.344 0-.64.05-.935.148-.296.099-.541.247-.738.445-.197.198-.394.445-.492.693-.148.247-.197.544-.246.841h4.772v-.05z"/>
                </svg>
              </a>
            </div>
          </div>
        </motion.div>
      </div>
    </footer>
  );
};

export default Footer;
