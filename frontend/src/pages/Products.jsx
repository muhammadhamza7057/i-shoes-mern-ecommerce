import React, { useEffect, useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import { productService } from '../services/productService';
import { useDebounce } from '../hooks/useDebounce';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ProductCard from '../components/product/ProductCard';
import Filters from '../components/product/Filters';

const defaultFilters = {
  search: '',
  category: '',
  brand: '',
  size: '',
  minPrice: '',
  maxPrice: '',
  rating: '',
};

const quickFilters = ['Sneakers', 'Formal Shoes', 'Sports Shoes', 'Boots'];

const Products = () => {
  const [filters, setFilters] = useState(defaultFilters);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [pagination, setPagination] = useState({ total: 0, pages: 1 });
  const productsGridRef = React.useRef(null);
  const debouncedSearch = useDebounce(filters.search, 350);

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const response = await productService.getAllProducts({
          page,
          limit: 12,
          search: debouncedSearch,
          category: filters.category,
          brand: filters.brand,
          size: filters.size,
          minPrice: filters.minPrice,
          maxPrice: filters.maxPrice,
          rating: filters.rating,
        });
        setProducts(response.products || []);
        setPagination(response.pagination || { total: 0, pages: 1 });
      } catch {
        setProducts([]);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page, debouncedSearch, filters.category, filters.brand, filters.size, filters.minPrice, filters.maxPrice, filters.rating]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    if (!productsGridRef.current) return undefined;

    const context = gsap.context(() => {
      const cards = gsap.utils.toArray('[data-morph-card]');
      cards.forEach((card, index) => {
        const spread = index % 4;

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
            y: spread === 0 ? -18 : spread === 1 ? 20 : spread === 2 ? -6 : 10,
            x: spread === 0 ? -14 : spread === 1 ? 14 : spread === 2 ? 22 : -10,
            rotate: spread === 0 ? -1.8 : spread === 1 ? 1.4 : spread === 2 ? 2.2 : -0.8,
            scale: 1.02,
            borderRadius: spread === 2 ? '58px' : '44px',
            clipPath: spread === 2 ? 'inset(2% 8% 2% 8% round 58px)' : 'inset(0% 0% 0% 0% round 44px)',
            ease: 'none',
            scrollTrigger: {
              trigger: productsGridRef.current,
              start: 'top 85%',
              end: 'bottom 15%',
              scrub: 0.75,
            },
          }
        );
      });
    }, productsGridRef);

    return () => context.revert();
  }, [products]);

  const updateFilter = (field, value) => {
    setPage(1);
    setFilters((current) => ({ ...current, [field]: value }));
  };

  const resetFilters = () => {
    setFilters(defaultFilters);
    setPage(1);
  };

  const productCountLabel = useMemo(() => `${pagination.total || 0} products`, [pagination.total]);

  return (
    <div className="space-y-8 pb-14">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="rounded-[36px] bg-[linear-gradient(135deg,#0B0B0B_0%,#151515_45%,#1A1A1A_100%)] px-6 py-8 text-white shadow-[0_30px_90px_rgba(11,11,11,0.18)] md:px-10"
      >
        <div className="flex flex-col gap-6 lg:flex-row lg:items-end lg:justify-between">
          <div className="max-w-2xl">
            <p className="section-kicker text-[#00FF88]">Browse collection</p>
            <h1 className="mt-4 text-4xl font-semibold md:text-6xl">Find the pair that matches your pace.</h1>
            <p className="mt-5 max-w-xl text-sm leading-7 text-white/68 md:text-base">
              Search, filter, and shop a premium shoe catalog with a modern grid, refined spacing, and motion-rich interactions.
            </p>
          </div>
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
            {quickFilters.map((label) => (
              <button
                key={label}
                type="button"
                onClick={() => updateFilter('category', label)}
                className={`rounded-full border px-4 py-2 text-xs font-bold uppercase tracking-[0.2em] transition ${filters.category === label ? 'border-[#00FF88] bg-[#00FF88] text-black' : 'border-white/15 bg-white/5 text-white/80'}`}
              >
                {label}
              </button>
            ))}
          </div>
        </div>
      </motion.section>

      <div className="grid gap-8 lg:grid-cols-[320px_minmax(0,1fr)]">
        <div className="lg:sticky lg:top-24 lg:self-start">
          <Filters filters={filters} onChange={updateFilter} onReset={resetFilters} />
        </div>

        <div className="space-y-6">
          <div className="flex flex-wrap items-end justify-between gap-4">
            <div>
              <p className="section-kicker">Storefront</p>
              <h2 className="section-title">All shoes</h2>
            </div>
            <div className="glass-panel rounded-full px-4 py-2 text-sm text-black/60">
              {productCountLabel}
            </div>
          </div>

          {loading ? (
            <LoadingSkeleton type="page" />
          ) : products.length ? (
            <>
              <div ref={productsGridRef} className="grid gap-6 sm:grid-cols-2 xl:grid-cols-3">
                {products.map((product, index) => (
                  <motion.div
                    key={product._id}
                    data-morph-card
                    initial={{ opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.04 }}
                    className="will-change-transform"
                  >
                    <ProductCard product={product} />
                  </motion.div>
                ))}
              </div>

              <div className="flex items-center justify-center gap-3 pt-4">
                <button disabled={page <= 1} onClick={() => setPage((current) => current - 1)} className="rounded-full border border-black/10 bg-white px-4 py-2 font-medium disabled:opacity-40">
                  Prev
                </button>
                <span className="text-sm text-black/50">Page {page} of {pagination.pages || 1}</span>
                <button disabled={page >= (pagination.pages || 1)} onClick={() => setPage((current) => current + 1)} className="rounded-full border border-black/10 bg-white px-4 py-2 font-medium disabled:opacity-40">
                  Next
                </button>
              </div>
            </>
          ) : (
            <div className="glass-panel rounded-[32px] p-10 text-center">
              <h3 className="text-2xl font-semibold text-black">No matches found</h3>
              <p className="mt-3 text-black/55">Try broadening the filters or clearing the search term.</p>
              <div className="mt-6 flex flex-wrap justify-center gap-3">
                <button onClick={resetFilters} className="rounded-full bg-black px-5 py-3 text-sm font-semibold text-white">
                  Clear filters
                </button>
                <Link to="/" className="rounded-full border border-black/10 px-5 py-3 text-sm font-semibold text-black">
                  Back home
                </Link>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Products;
