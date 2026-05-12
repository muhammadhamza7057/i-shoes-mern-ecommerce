import React from 'react';
import ProductCard from './ProductCard';

const RelatedProducts = ({ products = [] }) => {
  if (!products.length) return null;

  return (
    <section className="mt-16">
      <div className="mb-6 flex items-end justify-between gap-4">
        <div>
          <p className="text-xs font-semibold uppercase tracking-[0.3em] text-black/40">You may also like</p>
          <h2 className="mt-2 text-2xl font-semibold text-black">Related products</h2>
        </div>
      </div>
      <div className="grid gap-6 sm:grid-cols-2 xl:grid-cols-4">
        {products.slice(0, 4).map((product) => (
          <ProductCard key={product._id} product={product} cardLinkMode="full" />
        ))}
      </div>
    </section>
  );
};

export default RelatedProducts;
