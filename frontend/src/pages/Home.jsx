import React, { useEffect, useMemo, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { productService } from '../services/productService';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ProductCard from '../components/product/ProductCard';
import CollectionIcon from '../components/common/CollectionIcon';

const collectionCards = [
  { title: 'Summer Collection', copy: 'Breathable silhouettes, lighter materials, and sun-ready colorways.', icon: 'sun' },
  { title: 'Winter Collection', copy: 'Weather-ready builds with premium protection and deeper tones.', icon: 'snow' },
  { title: 'New Arrivals', copy: 'Fresh drops with clean lines and commercial appeal.', icon: 'spark' },
  { title: 'Best Sellers', copy: 'Customer favorites engineered for repeat wear.', icon: 'star' },
];

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const homeRef = useRef(null);
  const storySectionRef = useRef(null);
  const storyTrackRef = useRef(null);

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        const response = await productService.getAllProducts({ limit: 8, sortBy: 'rating', sortOrder: 'desc' });
        setFeatured(response.products || []);
      } catch {
        setFeatured([]);
      } finally {
        setLoading(false);
      }
    };

    fetchFeatured();
  }, []);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    const context = gsap.context(() => {
      const revealBlocks = gsap.utils.toArray('[data-reveal-trigger]');
      revealBlocks.forEach((block) => {
        const targets = block.querySelectorAll('[data-reveal]');
        if (!targets.length) return;

        gsap.from(targets, {
          opacity: 0,
          y: 30,
          duration: 0.85,
          stagger: 0.1,
          ease: 'power3.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: block,
            start: 'top 82%',
            once: true,
          }
        });
      });

      const imageTargets = gsap.utils.toArray('[data-gsap-reveal]');
      imageTargets.forEach((image) => {
        gsap.from(image, {
          opacity: 0,
          y: 16,
          scale: 0.985,
          duration: 0.72,
          ease: 'power2.out',
          immediateRender: false,
          scrollTrigger: {
            trigger: image,
            start: 'top 90%',
            once: true,
          }
        });
      });

      gsap.to('[data-parallax]', {
        y: 24,
        ease: 'none',
        scrollTrigger: {
          trigger: homeRef.current,
          start: 'top top',
          end: 'bottom top',
          scrub: true
        }
      });

      const morphCards = gsap.utils.toArray('[data-morph-card]');
      morphCards.forEach((card, index) => {
        const variant = index % 3;

        gsap.fromTo(
          card,
          {
            y: 0,
            x: 0,
            rotate: 0,
            scale: 1,
            borderRadius: '28px',
            clipPath: 'inset(0% 0% 0% 0% round 28px)',
          },
          {
            y: variant === 0 ? -22 : variant === 1 ? 18 : -8,
            x: variant === 0 ? -12 : variant === 1 ? 10 : 18,
            rotate: variant === 0 ? -1.6 : variant === 1 ? 1.8 : -0.9,
            scale: 1.02,
            borderRadius: index % 2 === 0 ? '42px' : '56px',
            clipPath: index % 2 === 0 ? 'inset(0% 0% 0% 0% round 42px)' : 'inset(0% 4% 0% 4% round 56px)',
            ease: 'none',
            scrollTrigger: {
              trigger: card,
              start: 'top 92%',
              end: 'bottom 18%',
              scrub: 0.8,
            },
          }
        );
      });

      const liquidDivider = homeRef.current?.querySelector('[data-liquid-divider]');
      const liquidPath = liquidDivider?.querySelector('path');
      if (liquidDivider && liquidPath) {
        gsap.fromTo(
          liquidPath,
          { scaleX: 0.82, opacity: 0.5 },
          {
            scaleX: 1,
            opacity: 1,
            transformOrigin: 'center center',
            ease: 'none',
            scrollTrigger: {
              trigger: liquidDivider,
              start: 'top 85%',
              end: 'bottom 40%',
              scrub: 0.8,
            },
          }
        );
      }

      if (storySectionRef.current && storyTrackRef.current) {
        const travelDistance = () => Math.max(0, storyTrackRef.current.scrollWidth - storySectionRef.current.offsetWidth);

        gsap.to(storyTrackRef.current, {
          x: () => -travelDistance(),
          ease: 'none',
          scrollTrigger: {
            trigger: storySectionRef.current,
            start: 'top top',
            end: () => `+=${travelDistance()}`,
            scrub: 1,
            pin: true,
            anticipatePin: 1,
            invalidateOnRefresh: true,
          },
        });
      }
    }, homeRef);

    return () => context.revert();
  }, []);

  const heroProduct = useMemo(() => featured[0], [featured]);

  return (
    <div ref={homeRef} className="space-y-20 pb-16">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="relative overflow-hidden rounded-[38px] bg-[radial-gradient(circle_at_top_left,_rgba(0,255,136,0.18),_transparent_28%),radial-gradient(circle_at_bottom_right,_rgba(255,255,255,0.08),_transparent_30%),linear-gradient(135deg,#0B0B0B_0%,#121212_50%,#1A1A1A_100%)] px-6 py-10 text-white shadow-[0_35px_100px_rgba(11,11,11,0.22)] md:px-10 md:py-14"
      >
        <div className="absolute inset-0 bg-[linear-gradient(120deg,transparent_0%,rgba(255,255,255,0.06)_50%,transparent_100%)] opacity-40" />
        <div className="grid gap-10 lg:grid-cols-[1.1fr_0.9fr] lg:items-center">
          <div className="relative z-10 max-w-3xl" data-parallax>
            <p className="section-kicker text-[#00FF88]">Premium shoes e-commerce</p>
            <h1 className="mt-5 max-w-2xl text-5xl font-semibold leading-[0.95] md:text-7xl lg:text-[5.5rem]">
              Move in style.
              <span className="block text-[#00FF88]">Own the street.</span>
            </h1>
            <p className="mt-6 max-w-2xl text-base leading-8 text-white/72 md:text-lg">
              I.Shoes blends commercial-ready commerce features, premium visuals, and motion-rich storytelling into a storefront that feels ready to sell on day one.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link to="/products" className="rounded-full bg-[#00FF88] px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-black transition-transform hover:-translate-y-0.5">
                Shop now
              </Link>
              <Link to="/wishlist" className="rounded-full border border-white/15 bg-white/8 px-7 py-3.5 text-sm font-bold uppercase tracking-[0.2em] text-white/90 backdrop-blur transition-transform hover:-translate-y-0.5">
                Wishlist
              </Link>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {[
                ['10+', 'Seeded products'],
                ['60fps', 'Motion system'],
                ['JWT', 'Protected flows'],
              ].map(([value, label]) => (
                <div key={label} className="rounded-[24px] border border-white/10 bg-white/8 p-4 backdrop-blur">
                  <div className="text-2xl font-semibold text-white">{value}</div>
                  <div className="mt-1 text-xs uppercase tracking-[0.25em] text-white/50">{label}</div>
                </div>
              ))}
            </div>
          </div>

          <div className="relative z-10 lg:pl-6">
            <div className="glass-panel rounded-[32px] p-4 text-black shadow-[0_25px_80px_rgba(0,0,0,0.25)]">
              <div className="overflow-hidden rounded-[26px] bg-[linear-gradient(180deg,#f8f8f8_0%,#ececec_100%)]">
                <img
                  src={heroProduct?.images?.[0]?.url || 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80'}
                  alt={heroProduct?.name || 'Featured shoe'}
                  className="h-[420px] w-full object-cover object-center"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = 'https://via.placeholder.com/1200x1200?text=I.Shoes';
                  }}
                />
              </div>
              <div className="mt-4 flex items-end justify-between gap-4">
                <div>
                  <p className="text-xs font-semibold uppercase tracking-[0.28em] text-black/45">Featured drop</p>
                  <h2 className="mt-2 text-2xl font-semibold text-black">{heroProduct?.name || 'Neon Runner Pro'}</h2>
                  <p className="mt-1 text-sm text-black/55">High-performance, premium-crafted, and built to convert.</p>
                </div>
                <Link to={`/products/${heroProduct?._id || ''}`} className="rounded-full bg-black px-4 py-2 text-sm font-semibold text-white">
                  View
                </Link>
              </div>
            </div>
          </div>
        </div>
      </motion.section>

      <section className="grid gap-4 md:grid-cols-4" data-reveal-trigger>
        <div className="col-span-full mb-2" data-liquid-divider>
          <svg viewBox="0 0 1200 80" className="h-10 w-full opacity-60" preserveAspectRatio="none" aria-hidden="true">
            <path d="M0,40 C160,10 280,70 420,40 C560,10 680,70 820,40 C960,10 1080,70 1200,40" fill="none" stroke="url(#liq-home)" strokeWidth="2.25" />
            <defs>
              <linearGradient id="liq-home" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="rgba(0,255,136,0)" />
                <stop offset="50%" stopColor="rgba(0,255,136,0.9)" />
                <stop offset="100%" stopColor="rgba(0,255,136,0)" />
              </linearGradient>
            </defs>
          </svg>
        </div>
        {collectionCards.map((card) => (
          <div key={card.title} data-reveal data-morph-card className="glass-panel rounded-[28px] p-5 will-change-transform">
            <div className="flex items-center justify-between">
              <div className="flex h-12 w-12 items-center justify-center rounded-2xl border border-black/5 bg-black/5 text-black/70 shadow-[0_12px_30px_rgba(0,0,0,0.08)]">
                <CollectionIcon name={card.icon} className="h-5 w-5" />
              </div>
              <span className="rounded-full bg-black/5 px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] text-black/50">Collection</span>
            </div>
            <h3 className="mt-6 text-xl font-semibold text-black">{card.title}</h3>
            <p className="mt-2 text-sm leading-7 text-black/60">{card.copy}</p>
          </div>
        ))}
      </section>

      <section className="grid gap-6 rounded-[36px] bg-white/70 p-6 shadow-[0_24px_70px_rgba(11,11,11,0.06)] backdrop-blur md:grid-cols-[0.86fr_1.14fr]" data-reveal-trigger>
        <div data-reveal>
          <p className="section-kicker">Categories</p>
          <h2 className="section-title">Built for every style of movement.</h2>
          <p className="mt-4 max-w-md text-sm leading-7 text-black/58">From sneakers to boots, each category is presented with premium spacing, clean hierarchy, and commercial-grade polish.</p>
          <Link to="/products" className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">Explore all products</Link>
        </div>

        <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {['Sneakers', 'Formal Shoes', 'Slippers', 'Boots'].map((item, index) => (
            <div key={item} data-reveal data-morph-card className="rounded-[28px] border border-black/5 bg-[linear-gradient(180deg,#ffffff_0%,#f5f5f3_100%)] p-5 will-change-transform">
              <div className="text-xs font-semibold uppercase tracking-[0.3em] text-black/35">0{index + 1}</div>
              <h3 className="mt-4 text-xl font-semibold text-black">{item}</h3>
              <p className="mt-2 text-sm text-black/55">Refined silhouettes, strong utility, and brand-ready presentation.</p>
            </div>
          ))}
        </div>
      </section>

      <section ref={storySectionRef} className="overflow-hidden rounded-[36px] bg-[#0b0b0b] py-8 text-white shadow-[0_30px_80px_rgba(11,11,11,0.2)]">
        <div className="mx-auto max-w-[1440px] px-6 md:px-8">
          <div className="mb-8 flex items-end justify-between gap-4">
            <div>
              <p className="section-kicker text-[#00FF88]">Story mode</p>
              <h2 className="section-title text-white">Horizontal product narrative.</h2>
            </div>
            <div className="text-right text-sm text-white/55">
              Scroll to explore the collection
            </div>
          </div>
        </div>

        <div className="overflow-hidden">
          <div ref={storyTrackRef} className="flex w-max gap-6 px-6 pb-4 md:px-8">
            {[
              {
                title: 'Movement crafted for performance',
                copy: 'Built for pace, impact control, and premium visual rhythm.',
                metric: '01',
                accent: 'from-[#00FF88] to-[#0f7f4d]',
              },
              {
                title: 'Luxury silhouettes for the street',
                copy: 'Sharp profiles, editorial shadows, and a tighter material story.',
                metric: '02',
                accent: 'from-[#cfd3d2] to-[#737f78]',
              },
              {
                title: 'Color systems that feel branded',
                copy: 'Every palette lands with strong contrast and premium restraint.',
                metric: '03',
                accent: 'from-[#3d3d3d] to-[#171717]',
              },
              {
                title: 'Commerce ready, not just pretty',
                copy: 'Wishlist, cart, checkout, and admin flows are already wired.',
                metric: '04',
                accent: 'from-[#00FF88] to-[#0b0b0b]',
              },
            ].map((panel, index) => (
              <article
                key={panel.metric}
                data-reveal
                data-morph-card
                className={`relative min-w-[86vw] overflow-hidden rounded-[32px] border border-white/10 p-6 md:min-w-[32rem] md:p-8 lg:min-w-[38rem] bg-gradient-to-br ${panel.accent} will-change-transform`}
              >
                <div className="flex h-full min-h-[300px] flex-col justify-between rounded-[28px] border border-white/15 bg-black/12 p-6 backdrop-blur-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold uppercase tracking-[0.3em] text-white/55">Experience</span>
                    <span className="text-sm font-bold text-white/85">{panel.metric}</span>
                  </div>
                  <div className="max-w-lg">
                    <h3 className="text-3xl font-semibold leading-tight text-white md:text-4xl">{panel.title}</h3>
                    <p className="mt-4 max-w-md text-sm leading-7 text-white/75">{panel.copy}</p>
                  </div>
                  <div className="mt-8 flex items-center gap-3 text-xs font-semibold uppercase tracking-[0.25em] text-white/55">
                    <span className="rounded-full border border-white/15 px-3 py-2">Scroll-pinned</span>
                    <span className="rounded-full border border-white/15 px-3 py-2">Parallax depth</span>
                    <span className="rounded-full border border-white/15 px-3 py-2">60fps</span>
                  </div>
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      <section data-reveal-trigger>
        <div className="mb-6 flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="section-kicker">New arrivals</p>
            <h2 className="section-title">Featured products</h2>
          </div>
          <div className="rounded-full border border-black/10 bg-white px-4 py-2 text-sm text-black/55">
            {featured.length || 10} products
          </div>
        </div>

        {loading ? (
          <LoadingSkeleton type="page" />
        ) : featured.length ? (
          <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
            {featured.map((product) => (
              <div key={product._id} data-morph-card className="will-change-transform">
                <ProductCard product={product} />
              </div>
            ))}
          </div>
        ) : (
          <div className="glass-panel rounded-[32px] p-10 text-center">
            <h3 className="text-2xl font-semibold text-black">No products found</h3>
            <p className="mt-3 text-black/55">The backend is reachable, but the catalog query returned empty. Try refreshing or checking the seed data.</p>
            <Link to="/products" className="mt-6 inline-flex rounded-full bg-black px-6 py-3 text-sm font-semibold text-white">
              Open catalog
            </Link>
          </div>
        )}
      </section>
    </div>
  );
};

export default Home;
