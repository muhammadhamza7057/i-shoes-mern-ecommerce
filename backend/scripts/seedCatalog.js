import { env } from '../src/config/env.js';
import connectDB from '../src/config/db.js';
import { categories as Category, products as Product } from '../src/repositories/index.js';
import logger from '../src/utils/logger.js';
import { slugify } from '../src/utils/helpers.js';

const CATEGORIES = ['Sneakers', 'Formal Shoes', 'Sports Shoes', 'Boots'];

const SAMPLE_PRODUCTS = [
  {
    name: 'Neon Runner Pro',
    brand: 'I.Shoes',
    description: 'Lightweight performance runner with premium cushioning.',
    basePrice: 129,
    salePrice: 109,
    featured: true,
    category: 'Sneakers',
    variants: [
      { size: '8', color: 'Black', stock: 15 },
      { size: '9', color: 'Black', stock: 20 },
      { size: '10', color: 'White', stock: 12 },
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=800&q=80',
        altText: 'Neon Runner Pro',
        color: 'Black',
      },
    ],
  },
  {
    name: 'Classic Oxford',
    brand: 'I.Shoes',
    description: 'Hand-finished formal oxford for everyday elegance.',
    basePrice: 149,
    salePrice: null,
    featured: true,
    category: 'Formal Shoes',
    variants: [
      { size: '9', color: 'Brown', stock: 8 },
      { size: '10', color: 'Brown', stock: 10 },
    ],
    images: [
      {
        url: 'https://images.unsplash.com/photo-1614252238956-b8c5a4d2a7f3?auto=format&fit=crop&w=800&q=80',
        altText: 'Classic Oxford',
      },
    ],
  },
];

const run = async () => {
  await connectDB();

  const categoryMap = {};
  for (const name of CATEGORIES) {
    const slug = slugify(name);
    let category = await Category.findBySlug(slug);
    if (!category) {
      category = await Category.create({ name, slug, isActive: true });
      logger.info({ name }, 'Category created');
    }
    categoryMap[name] = category._id;
  }

  for (const sample of SAMPLE_PRODUCTS) {
    const slug = slugify(sample.name);
    const existing = await Product.findBySlug(slug);
    if (existing) {
      logger.info({ slug }, 'Product already exists — skipped');
      continue;
    }

    const productSlug = slug;
    const variants = sample.variants.map((v, i) => ({
      size: String(v.size),
      color: v.color,
      sku: `${productSlug}-${v.size}-${v.color}-${i + 1}`.toUpperCase().replace(/\s+/g, ''),
      price: sample.salePrice ?? sample.basePrice,
      stock: v.stock,
      reservedStock: 0,
      soldStock: 0,
    }));

    await Product.create({
      name: sample.name,
      slug,
      description: sample.description,
      brand: sample.brand,
      category: categoryMap[sample.category],
      images: sample.images,
      thumbnail: sample.images[0]?.url || '',
      basePrice: sample.basePrice,
      salePrice: sample.salePrice,
      variants,
      featured: sample.featured,
      status: 'active',
      tags: [sample.category],
    });

    logger.info({ slug }, 'Product seeded');
  }

  logger.info('Catalog seed complete');
};

run().catch((err) => {
  logger.error(err, 'seedCatalog failed');
  process.exit(1);
});
