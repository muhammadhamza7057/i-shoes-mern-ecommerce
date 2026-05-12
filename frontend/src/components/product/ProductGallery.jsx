import React, { useEffect, useState } from 'react';
import { AnimatePresence, motion } from 'framer-motion';

const ProductGallery = ({ images = [], productId, activeColor, productColors = [], colorImageMap = {} }) => {
  const fallback = 'https://via.placeholder.com/1200x1200?text=I.Shoes';
  const normalized = images.length ? images : [{ url: fallback, altText: 'Product image' }];
  const [activeIndex, setActiveIndex] = useState(0);

  const selectedImageIndex = React.useMemo(() => {
    if (!activeColor) return 0;

    const selected = activeColor.toLowerCase();
    const mappedImage = colorImageMap[selected];
    if (mappedImage?.url) {
      const mappedIndex = normalized.findIndex((image) => image.url === mappedImage.url);
      if (mappedIndex >= 0) return mappedIndex;
    }

    const exactColorMatch = normalized.findIndex((image) => (image.color || '').toLowerCase() === selected);
    if (exactColorMatch >= 0) return exactColorMatch;

    const altTextMatch = normalized.findIndex((image) => (image.altText || '').toLowerCase().includes(selected));
    if (altTextMatch >= 0) return altTextMatch;

    const colorIndex = productColors.findIndex((color) => color.toLowerCase() === selected);
    if (colorIndex >= 0 && normalized[colorIndex]) return colorIndex;

    const indexedMatch = normalized.findIndex((image, index) => index === colorIndex);
    if (indexedMatch >= 0) return indexedMatch;

    return 0;
  }, [activeColor, normalized, productColors, colorImageMap]);

  useEffect(() => {
    setActiveIndex(selectedImageIndex);
  }, [selectedImageIndex]);

  const activeImage = normalized[activeIndex] || normalized[selectedImageIndex] || normalized[0] || { url: fallback, altText: 'Product image' };

  return (
    <div className="space-y-4">
      <motion.div
        className="group overflow-hidden rounded-[32px] bg-[#f5f5f5] shadow-[0_20px_60px_rgba(0,0,0,0.08)]"
        layoutId={productId ? `product-media-${productId}` : undefined}
      >
        <AnimatePresence mode="wait">
          <motion.img
            key={activeImage?.url || fallback}
            src={activeImage?.url || fallback}
            alt={activeImage?.altText || 'Product image'}
            className="aspect-square h-full w-full object-cover"
            onError={(event) => {
              event.currentTarget.onerror = null;
              event.currentTarget.src = fallback;
            }}
            initial={{ opacity: 0, scale: 1.04 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.98 }}
            transition={{ duration: 0.28, ease: 'easeOut' }}
            whileHover={{ scale: 1.04 }}
          />
        </AnimatePresence>
      </motion.div>
      <div className="grid grid-cols-4 gap-3">
        {normalized.map((image, index) => (
          <motion.button
            key={image.url + index}
            type="button"
            onClick={() => setActiveIndex(index)}
            whileTap={{ scale: 0.96 }}
            className={`overflow-hidden rounded-2xl border-2 transition ${index === activeIndex ? 'border-[#00FF88]' : 'border-transparent'}`}
          >
            <img
              src={image.url}
              alt={image.altText || 'Thumbnail'}
              className="aspect-square w-full object-cover"
              onError={(event) => {
                event.currentTarget.onerror = null;
                event.currentTarget.src = fallback;
              }}
            />
          </motion.button>
        ))}
      </div>
    </div>
  );
};

export default ProductGallery;
