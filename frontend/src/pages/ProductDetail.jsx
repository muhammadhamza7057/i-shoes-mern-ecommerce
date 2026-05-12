import React, { useEffect, useMemo, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import toast from 'react-hot-toast';
import { productService } from '../services/productService';
import { formatPrice } from '../utils/formatters';
import { APP_CONSTANTS } from '../utils/constants';
import LoadingSkeleton from '../components/common/LoadingSkeleton';
import ProductGallery from '../components/product/ProductGallery';
import RelatedProducts from '../components/product/RelatedProducts';
import { useCart } from '../hooks/useCart';
import { useWishlist } from '../hooks/useWishlist';
import { useAuth } from '../hooks/useAuth';
import LoginPromptModal from '../components/common/LoginPromptModal';
import { useLoginPrompt } from '../hooks/useLoginPrompt';

const ProductDetail = () => {
  const { id } = useParams();
  const { addToCart } = useCart();
  const { toggleWishlist, isWishlisted } = useWishlist();
  const { isAuthenticated } = useAuth();
  const { isOpen: promptOpen, actionLabel: promptLabel, promptLogin, closePrompt } = useLoginPrompt();
  const [product, setProduct] = useState(null);
  const [relatedProducts, setRelatedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState('');
  const [selectedColor, setSelectedColor] = useState('');
  const [variantNotice, setVariantNotice] = useState('');
  const detailRef = React.useRef(null);

  const colorImageMap = useMemo(() => {
    if (!product?.images?.length || !product?.colors?.length) return {};

    return product.colors.reduce((map, color, index) => {
      const colorKey = color.toLowerCase();
      const explicitMatch = product.images.find((image) => (image.color || '').toLowerCase() === colorKey);
      const indexedMatch = product.images[index];

      if (explicitMatch?.url) {
        map[colorKey] = explicitMatch;
      } else if (indexedMatch?.url) {
        map[colorKey] = indexedMatch;
      }

      return map;
    }, {});
  }, [product]);

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await productService.getProductById(id);
        setProduct(response.product);

        const listResponse = await productService.getAllProducts({ limit: 8, category: response.product?.category });
        setRelatedProducts((listResponse.products || []).filter((item) => item._id !== response.product?._id));
      } catch {
        setProduct(null);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id]);

  useEffect(() => {
    if (!product) return;
    setSelectedSize(product.sizes?.[0] ? String(product.sizes[0]) : '');
    setSelectedColor(Object.keys(colorImageMap)[0] || product.colors?.[0] || '');
    setVariantNotice('');
  }, [product, colorImageMap]);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (!detailRef.current) return undefined;

    const context = gsap.context(() => {
      gsap.from('[data-detail-reveal]', {
        opacity: 0,
        y: 22,
        duration: 0.85,
        stagger: 0.08,
        ease: 'power3.out',
        immediateRender: false,
        scrollTrigger: {
          trigger: detailRef.current,
          start: 'top 88%',
          once: true,
        },
      });

      gsap.fromTo(
        '[data-price-orbit]',
        { y: 0, rotate: 0, scale: 1 },
        {
          y: -12,
          rotate: 1.5,
          scale: 1.01,
          ease: 'none',
          scrollTrigger: {
            trigger: detailRef.current,
            start: 'top top',
            end: 'bottom top',
            scrub: 0.6,
          },
        }
      );

      gsap.fromTo(
        '[data-detail-wave] path',
        { scaleX: 0.7, opacity: 0.35 },
        {
          scaleX: 1,
          opacity: 1,
          transformOrigin: 'center center',
          ease: 'none',
          scrollTrigger: {
            trigger: detailRef.current,
            start: 'top 92%',
            end: 'bottom 35%',
            scrub: 0.7,
          },
        }
      );
    }, detailRef);

    return () => context.revert();
  }, [product]);

  const availableColors = useMemo(() => new Set(Object.keys(colorImageMap)), [colorImageMap]);
  const availableSizes = useMemo(() => new Set((product?.sizes || []).map((size) => String(size))), [product]);
  const canAdd = useMemo(() => Boolean(product && selectedSize && selectedColor), [product, selectedSize, selectedColor]);

  if (loading) return <LoadingSkeleton type="page" />;
  if (!product) return <div className="rounded-3xl border bg-white p-10 text-center">Product not found.</div>;

  const handleAdd = () => {
    if (!isAuthenticated) {
      promptLogin('add to cart');
      return;
    }
    if (!product.stock || product.stock <= 0) {
      toast.error('Not in stock');
      return;
    }

    if (!availableSizes.has(String(selectedSize))) {
      toast.error('Selected size is not in stock');
      return;
    }

    if (!availableColors.has(selectedColor.toLowerCase())) {
      toast.error('Selected color is not available');
      return;
    }

    addToCart({
      ...product,
      selectedSize,
      selectedColor,
      quantity: 1
    });
    toast.success('Added to cart');
    try {
      window.dispatchEvent(new CustomEvent('cursor-burst', { detail: { color: '#00FF88' } }));
    } catch (_) {}
  };

  const handleWishlist = () => {
    if (!isAuthenticated) {
      promptLogin('save to wishlist');
      return;
    }
    toggleWishlist(product);
  };

  return (
    <div ref={detailRef} className="space-y-16 pb-10">
      <motion.section
        initial={{ opacity: 0, y: 18 }}
        animate={{ opacity: 1, y: 0 }}
        className="grid gap-10 rounded-[36px] bg-white/80 p-6 shadow-[0_24px_70px_rgba(11,11,11,0.06)] backdrop-blur lg:grid-cols-2 lg:p-8"
      >
        <div data-detail-reveal>
          <ProductGallery images={product.images} productId={product._id} activeColor={selectedColor} productColors={product.colors || []} colorImageMap={colorImageMap} />
        </div>

        <div className="space-y-6">
          <div data-detail-reveal>
            <p className="section-kicker">{product.brand}</p>
            <h1 className="mt-4 text-4xl font-semibold text-black md:text-5xl">{product.name}</h1>
            <p className="mt-4 text-lg leading-8 text-black/60">{product.description}</p>
          </div>

          <div className="flex flex-wrap items-center gap-4 text-sm text-black/55" data-detail-reveal>
            <span>★ {product.rating}</span>
            <span>{product.category}</span>
            <span>{product.collection}</span>
            <span>{product.gender}</span>
          </div>

          <div className="rounded-[28px] bg-black px-5 py-4 text-white shadow-[0_18px_45px_rgba(11,11,11,0.16)]" data-price-orbit data-detail-reveal>
            <div className="text-xs uppercase tracking-[0.3em] text-white/45">Price</div>
            <div className="mt-2 text-3xl font-semibold">{formatPrice(product.finalPrice || product.price)}</div>
          </div>
          <div data-detail-reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-black/40">Size</p>
            <div className="flex flex-wrap gap-3">
              {APP_CONSTANTS.SHOE_SIZES.map((size) => {
                const available = availableSizes.has(String(size));
                return (
                <motion.button
                  key={size}
                  type="button"
                  onClick={() => {
                    if (!available) {
                      setVariantNotice(`Size ${size} is not available for this product.`);
                      toast.error(`Size ${size} is not available`);
                      return;
                    }
                    setSelectedSize(String(size));
                    setVariantNotice('');
                  }}
                  whileTap={{ scale: 0.96 }}
                  aria-disabled={!available}
                  className={`rounded-full border px-4 py-2 transition ${selectedSize === String(size) ? 'border-black bg-black text-white' : available ? 'border-black/10 bg-white' : 'cursor-not-allowed border-dashed border-black/10 bg-black/[0.03] text-black/35'}`}
                >
                  {size}
                </motion.button>
                );
              })}
            </div>
          </div>

          <div data-detail-reveal>
            <p className="mb-3 text-sm font-semibold uppercase tracking-[0.25em] text-black/40">Color</p>
            <div className="flex flex-wrap gap-3">
              {APP_CONSTANTS.COLOR_OPTIONS.map((colorOption) => {
                const available = availableColors.has(colorOption.name.toLowerCase());
                const isSelected = selectedColor.toLowerCase() === colorOption.name.toLowerCase();
                return (
                <motion.button
                  key={colorOption.name}
                  type="button"
                  onClick={() => {
                    if (!available) {
                      setVariantNotice(`${colorOption.name} is not available for this product.`);
                      toast.error(`${colorOption.name} is not available`);
                      return;
                    }
                    setSelectedColor(colorOption.name);
                    setVariantNotice('');
                  }}
                  whileTap={{ scale: 0.96 }}
                  aria-disabled={!available}
                  className={`flex items-center gap-2 rounded-full border px-4 py-2 transition ${isSelected ? 'border-[#00FF88] bg-[#00FF88] text-black' : available ? 'border-black/10 bg-white' : 'cursor-not-allowed border-dashed border-black/10 bg-black/[0.03] text-black/35'}`}
                >
                  <span
                    className="h-4 w-4 rounded-full border border-black/10"
                    style={{ backgroundColor: colorOption.hex, opacity: available ? 1 : 0.35 }}
                  />
                  {colorOption.name}
                </motion.button>
                );
              })}
            </div>
          </div>

          {variantNotice && (
            <div className="rounded-2xl border border-amber-200 bg-amber-50 px-4 py-3 text-sm font-medium text-amber-800">
              {variantNotice}
            </div>
          )}

          <div className="flex flex-wrap gap-4" data-detail-reveal>
            <button onClick={handleAdd} disabled={!canAdd} className="rounded-full bg-black px-6 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:opacity-40">
              {product.stock > 0 ? 'Add to Cart' : 'Not in Stock'}
            </button>
            <button onClick={handleWishlist} className="rounded-full border border-black/10 px-6 py-3 font-semibold text-black transition hover:bg-black/5">
              {isWishlisted(product._id) ? '♥ Remove Wishlist' : '♡ Add Wishlist'}
            </button>
            <Link to="/cart" className="rounded-full border border-black/10 px-6 py-3 font-semibold text-black transition hover:bg-black/5">
              Go to Cart
            </Link>
          </div>
        </div>
      </motion.section>

      <div data-detail-wave>
        <svg viewBox="0 0 1200 80" className="h-10 w-full opacity-60" preserveAspectRatio="none" aria-hidden="true">
          <path d="M0,40 C150,10 300,70 450,40 C600,10 750,70 900,40 C1050,10 1150,70 1200,40" fill="none" stroke="rgba(0,255,136,0.85)" strokeWidth="2.25" />
        </svg>
      </div>

      <div data-detail-reveal>
        <RelatedProducts products={relatedProducts} />
      </div>

      <LoginPromptModal
        isOpen={promptOpen}
        onClose={closePrompt}
        actionLabel={promptLabel}
      />
    </div>
  );
};

export default ProductDetail;
