import React from 'react';
import { APP_CONSTANTS } from '../../utils/constants';

const Filters = ({ filters, onChange, onReset }) => {
  return (
    <aside className="glass-panel rounded-[32px] p-5">
      <div className="flex items-center justify-between gap-4">
        <h3 className="text-lg font-semibold text-black">Filters</h3>
        <button onClick={onReset} className="text-sm font-semibold text-[#00A85A] transition hover:text-black">Reset</button>
      </div>

      <div className="mt-5 space-y-5">
        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Search</label>
          <input
            value={filters.search}
            onChange={(e) => onChange('search', e.target.value)}
            placeholder="Search shoes"
            className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Category</label>
          <select
            value={filters.category}
            onChange={(e) => onChange('category', e.target.value)}
            className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
          >
            <option value="">All</option>
            {APP_CONSTANTS.CATEGORIES.map((item) => (
              <option key={item} value={item}>{item}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Brand</label>
          <input
            value={filters.brand}
            onChange={(e) => onChange('brand', e.target.value)}
            placeholder="Brand"
            className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
          />
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Size</label>
          <select
            value={filters.size}
            onChange={(e) => onChange('size', e.target.value)}
            className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
          >
            <option value="">All</option>
            {APP_CONSTANTS.SHOE_SIZES.map((size) => (
              <option key={size} value={size}>{size}</option>
            ))}
          </select>
        </div>

        <div className="grid grid-cols-2 gap-3">
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Min</label>
            <input
              type="number"
              min="0"
              value={filters.minPrice}
              onChange={(e) => onChange('minPrice', e.target.value)}
              className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
            />
          </div>
          <div>
            <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Max</label>
            <input
              type="number"
              min="0"
              value={filters.maxPrice}
              onChange={(e) => onChange('maxPrice', e.target.value)}
              className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
            />
          </div>
        </div>

        <div>
          <label className="mb-2 block text-xs font-semibold uppercase tracking-[0.2em] text-black/45">Rating</label>
          <select
            value={filters.rating}
            onChange={(e) => onChange('rating', e.target.value)}
            className="w-full rounded-[20px] border border-black/10 bg-white/90 px-4 py-3 outline-none transition focus:border-[#00FF88]"
          >
            <option value="">Any</option>
            <option value="4">4+</option>
            <option value="4.5">4.5+</option>
            <option value="5">5</option>
          </select>
        </div>
      </div>
    </aside>
  );
};

export default Filters;
