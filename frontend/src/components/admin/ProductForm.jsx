import React, { useEffect, useRef, useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';
import { APP_CONSTANTS } from '../../utils/constants';
import CollectionIcon from '../common/CollectionIcon';

const defaultForm = {
  name:        '',
  description: '',
  price:       '',
  discount:    0,
  brand:       'I.Shoes',
  category:    APP_CONSTANTS.CATEGORIES[0],
  collection:  APP_CONSTANTS.COLLECTIONS[2].name,
  gender:      'unisex',
  sizes:       '7,8,9,10',
  colors:      'Black,White',
  stock:       0,
  images:      '',   // newline-separated "Color | URL" entries
};

// Parse the textarea image entries into structured objects
const parseImageEntries = (raw, productName) =>
  raw
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [a, b] = line.split('|').map((s) => s.trim());
      if (b) return { url: b, altText: `${productName} ${a}`.trim(), color: a };
      return { url: a, altText: productName };
    });

const ProductForm = ({ initialValue, onSubmit, submitLabel = 'Save Product' }) => {
  const [form, setForm] = useState(initialValue || defaultForm);
  const fileInputRef = useRef(null);
  const [imagePreviews, setImagePreviews] = useState([]);

  // Sync when parent passes a new initialValue (edit mode)
  useEffect(() => {
    setForm(initialValue || defaultForm);
  }, [initialValue]);

  // Live image preview from textarea
  useEffect(() => {
    const entries = parseImageEntries(form.images || '', form.name || 'Product');
    setImagePreviews(entries.map((e) => e.url).filter(Boolean).slice(0, 6));
  }, [form.images, form.name]);

  const set = (field, value) => setForm((prev) => ({ ...prev, [field]: value }));

  // Handle file upload → convert to data URL and append to textarea
  const handleFileUpload = (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    files.forEach((file) => {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const dataUrl = ev.target.result;
        set('images', (prev) => {
          const current = form.images.trim();
          return current ? `${current}\n${dataUrl}` : dataUrl;
        });
        // Use functional update via direct state setter
        setForm((prev) => {
          const current = prev.images.trim();
          return { ...prev, images: current ? `${current}\n${dataUrl}` : dataUrl };
        });
      };
      reader.readAsDataURL(file);
    });

    // Reset file input
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    if (!form.name.trim()) { toast.error('Product name is required'); return; }
    if (!form.price || Number(form.price) <= 0) { toast.error('Valid price is required'); return; }

    const parsedImages = parseImageEntries(form.images || '', form.name);

    // Relaxed validation: only warn if multiple colors declared but NONE have images
    const declaredColors = form.colors.split(',').map((c) => c.trim()).filter(Boolean);
    if (declaredColors.length > 1 && parsedImages.length > 0) {
      const coloredImages = parsedImages.filter((img) => img.color);
      if (coloredImages.length === 0) {
        // Single fallback image is fine — just warn, don't block
        toast('Tip: add "Color | URL" entries to enable per-color image switching.', { icon: '💡' });
      }
    }

    onSubmit({
      ...form,
      price:    Number(form.price),
      discount: Number(form.discount || 0),
      stock:    Number(form.stock    || 0),
      sizes:    form.sizes.split(',').map((s) => Number(s.trim())).filter((n) => !isNaN(n) && n > 0),
      colors:   form.colors.split(',').map((c) => c.trim()).filter(Boolean),
      images:   parsedImages,
    });
  };

  const inputClass =
    'w-full rounded-2xl border border-black/10 bg-black/[0.02] px-4 py-3 text-sm text-black placeholder:text-black/30 focus:border-black/25 focus:bg-white focus:outline-none focus:ring-2 focus:ring-[#00FF88]/25 transition';

  const labelClass = 'block mb-1.5 text-xs font-semibold uppercase tracking-[0.2em] text-black/45';

  return (
    <form
      onSubmit={handleSubmit}
      className="rounded-[28px] border border-black/5 bg-white p-6 shadow-sm"
    >
      <div className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">
          Product editor
        </p>
        <h3 className="mt-1 text-2xl font-semibold text-black">
          {submitLabel}
        </h3>
      </div>

      <div className="grid gap-5 md:grid-cols-2">
        {/* Name */}
        <div>
          <label htmlFor="pf-name" className={labelClass}>Name</label>
          <input id="pf-name" className={inputClass} placeholder="Air Max Pro" value={form.name} onChange={(e) => set('name', e.target.value)} required />
        </div>

        {/* Brand */}
        <div>
          <label htmlFor="pf-brand" className={labelClass}>Brand</label>
          <input id="pf-brand" className={inputClass} placeholder="I.Shoes" value={form.brand} onChange={(e) => set('brand', e.target.value)} />
        </div>

        {/* Description */}
        <div className="md:col-span-2">
          <label htmlFor="pf-desc" className={labelClass}>Description</label>
          <textarea
            id="pf-desc"
            className={`${inputClass} min-h-[96px] resize-y`}
            placeholder="Premium silhouette engineered for performance and street-ready style."
            value={form.description}
            onChange={(e) => set('description', e.target.value)}
          />
        </div>

        {/* Price */}
        <div>
          <label htmlFor="pf-price" className={labelClass}>Price ($)</label>
          <input id="pf-price" type="number" min="0" step="0.01" className={inputClass} placeholder="129.99" value={form.price} onChange={(e) => set('price', e.target.value)} required />
        </div>

        {/* Discount */}
        <div>
          <label htmlFor="pf-discount" className={labelClass}>Discount (%)</label>
          <input id="pf-discount" type="number" min="0" max="100" className={inputClass} placeholder="0" value={form.discount} onChange={(e) => set('discount', e.target.value)} />
        </div>

        {/* Stock */}
        <div>
          <label htmlFor="pf-stock" className={labelClass}>Stock</label>
          <input id="pf-stock" type="number" min="0" className={inputClass} placeholder="50" value={form.stock} onChange={(e) => set('stock', e.target.value)} />
        </div>

        {/* Category */}
        <div>
          <label htmlFor="pf-cat" className={labelClass}>Category</label>
          <select id="pf-cat" className={inputClass} value={form.category} onChange={(e) => set('category', e.target.value)}>
            {APP_CONSTANTS.CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
          </select>
        </div>

        {/* Collection */}
        <div>
          <label htmlFor="pf-col" className={labelClass}>Collection</label>
          <div className="flex items-center gap-2">
            <div className="flex h-[46px] w-[46px] shrink-0 items-center justify-center rounded-2xl border border-black/8 bg-black/[0.03]">
              <CollectionIcon
                name={APP_CONSTANTS.COLLECTIONS.find((c) => c.name === form.collection)?.icon}
                className="h-5 w-5 text-black/55"
              />
            </div>
            <select id="pf-col" className={inputClass} value={form.collection} onChange={(e) => set('collection', e.target.value)}>
              {APP_CONSTANTS.COLLECTIONS.map((c) => <option key={c.name} value={c.name}>{c.name}</option>)}
            </select>
          </div>
        </div>

        {/* Gender */}
        <div>
          <label htmlFor="pf-gender" className={labelClass}>Gender</label>
          <select id="pf-gender" className={inputClass} value={form.gender} onChange={(e) => set('gender', e.target.value)}>
            {APP_CONSTANTS.GENDERS.map((g) => (
              <option key={g} value={g}>{g.charAt(0).toUpperCase() + g.slice(1)}</option>
            ))}
          </select>
        </div>

        {/* Sizes */}
        <div className="md:col-span-2">
          <label htmlFor="pf-sizes" className={labelClass}>Sizes (comma-separated)</label>
          <input id="pf-sizes" className={inputClass} placeholder="7, 8, 9, 10, 11" value={form.sizes} onChange={(e) => set('sizes', e.target.value)} />
          <p className="mt-1.5 text-xs text-black/38">Example: 7, 8, 9, 10, 11, 12</p>
        </div>

        {/* Colors */}
        <div className="md:col-span-2">
          <label htmlFor="pf-colors" className={labelClass}>Colors (comma-separated)</label>
          <input id="pf-colors" className={inputClass} placeholder="Black, White, Grey" value={form.colors} onChange={(e) => set('colors', e.target.value)} />
          <p className="mt-1.5 text-xs text-black/38">Example: Black, White, Grey, Red</p>
        </div>

        {/* Images */}
        <div className="md:col-span-2">
          <label className={labelClass}>Product images</label>

          {/* File upload */}
          <div className="mb-3 flex items-center gap-3">
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="rounded-full border border-black/10 px-4 py-2 text-xs font-semibold text-black hover:bg-black/5 transition"
            >
              ↑ Upload image files
            </button>
            <span className="text-xs text-black/38">or paste URLs below</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={handleFileUpload}
            />
          </div>

          <textarea
            className={`${inputClass} min-h-[100px] resize-y font-mono text-xs`}
            placeholder={'Black | https://example.com/black-shoe.jpg\nWhite | https://example.com/white-shoe.jpg\nhttps://example.com/fallback.jpg'}
            value={form.images}
            onChange={(e) => set('images', e.target.value)}
          />
          <p className="mt-1.5 text-xs text-black/38">
            Format: <code className="rounded bg-black/5 px-1">Color | URL</code> — one per line. Omit color for a general fallback image.
          </p>

          {/* Live image previews */}
          <AnimatePresence>
            {imagePreviews.length > 0 && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="mt-4 flex flex-wrap gap-3 overflow-hidden"
              >
                {imagePreviews.map((url, i) => (
                  <div
                    key={i}
                    className="h-20 w-20 overflow-hidden rounded-2xl border border-black/8 bg-black/5"
                  >
                    <img
                      src={url}
                      alt={`Preview ${i + 1}`}
                      className="h-full w-full object-cover"
                      onError={(e) => { e.currentTarget.style.display = 'none'; }}
                    />
                  </div>
                ))}
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>

      <div className="mt-6 flex flex-wrap gap-3">
        <button
          type="submit"
          className="rounded-full bg-black px-6 py-3 text-sm font-semibold text-white transition hover:-translate-y-0.5"
        >
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default ProductForm;
