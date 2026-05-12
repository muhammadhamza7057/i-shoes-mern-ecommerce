import User from '../models/User.js';
import Product from '../models/Product.js';

const sampleProducts = [
  {
    name: 'Neon Runner Pro',
    description: 'Lightweight premium running sneakers built for speed, comfort, and all-day wear.',
    price: 129,
    discount: 15,
    brand: 'I.Shoes',
    category: 'Sneakers',
    collection: 'New Arrivals',
    gender: 'unisex',
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ['Black', 'Neon Green', 'White'],
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', altText: 'Neon Runner Pro', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1515955656352-a1fa3ffcd111?auto=format&fit=crop&w=1200&q=80', altText: 'Neon Runner Pro White', color: 'White' },
      { url: 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?auto=format&fit=crop&w=1200&q=80', altText: 'Neon Runner Pro Neon Green', color: 'Neon Green' }
    ],
    stock: 24,
    rating: 4.8,
    soldCount: 120,
    isActive: true
  },
  {
    name: 'Executive Leather Oxford',
    description: 'Minimal luxury formal shoe with premium leather finish for business and occasion wear.',
    price: 159,
    discount: 10,
    brand: 'I.Shoes',
    category: 'Formal Shoes',
    collection: 'Best Sellers',
    gender: 'men',
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['Black', 'Brown'],
    images: [
      { url: 'https://images.unsplash.com/photo-1614251055880-ee96e4803393?auto=format&fit=crop&w=1200&q=80', altText: 'Executive Leather Oxford Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1616845504692-1f6ad4d5f0a9?auto=format&fit=crop&w=1200&q=80', altText: 'Executive Leather Oxford Brown', color: 'Brown' }
    ],
    stock: 16,
    rating: 4.7,
    soldCount: 88,
    isActive: true
  },
  {
    name: 'Cloud Comfort Slides',
    description: 'Ultra-soft slippers designed for indoor and outdoor relaxation with a premium feel.',
    price: 49,
    discount: 0,
    brand: 'I.Shoes',
    category: 'Slippers',
    collection: 'Summer Collection',
    gender: 'unisex',
    sizes: [6, 7, 8, 9, 10, 11],
    colors: ['Black', 'White', 'Grey'],
    images: [
      { url: 'https://images.unsplash.com/photo-1600185365483-26d7a4cc7519?auto=format&fit=crop&w=1200&q=80', altText: 'Cloud Comfort Slides Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1519415943484-9fa1873496d4?auto=format&fit=crop&w=1200&q=80', altText: 'Cloud Comfort Slides White', color: 'White' },
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?auto=format&fit=crop&w=1200&q=80', altText: 'Cloud Comfort Slides Grey', color: 'Grey' }
    ],
    stock: 35,
    rating: 4.5,
    soldCount: 64,
    isActive: true
  },
  {
    name: 'Velocity Sports Elite',
    description: 'Performance sports shoes for training, impact support, and daily athletic use.',
    price: 139,
    discount: 20,
    brand: 'I.Shoes',
    category: 'Sports Shoes',
    collection: 'Winter Collection',
    gender: 'men',
    sizes: [7, 8, 9, 10, 11, 12, 13],
    colors: ['Black', 'Red'],
    images: [
      { url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?auto=format&fit=crop&w=1200&q=80', altText: 'Velocity Sports Elite Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1539185441755-769473a23570?auto=format&fit=crop&w=1200&q=80', altText: 'Velocity Sports Elite Red', color: 'Red' }
    ],
    stock: 18,
    rating: 4.9,
    soldCount: 132,
    isActive: true
  },
  {
    name: 'Urban Trek Boots',
    description: 'Rugged premium boots with durable outsole and elevated streetwear styling.',
    price: 189,
    discount: 12,
    brand: 'I.Shoes',
    category: 'Boots',
    collection: 'New Arrivals',
    gender: 'unisex',
    sizes: [8, 9, 10, 11, 12, 13],
    colors: ['Black', 'Tan'],
    images: [
      { url: 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?auto=format&fit=crop&w=1200&q=80', altText: 'Urban Trek Boots Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?auto=format&fit=crop&w=1200&q=80', altText: 'Urban Trek Boots Tan', color: 'Tan' }
    ],
    stock: 12,
    rating: 4.6,
    soldCount: 51,
    isActive: true
  },
  {
    name: 'Minimal Flex Runner',
    description: 'Lightweight runner with breathable mesh, everyday comfort, and a premium silhouette.',
    price: 109,
    discount: 8,
    brand: 'I.Shoes',
    category: 'Sneakers',
    collection: 'Summer Collection',
    gender: 'unisex',
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ['White', 'Black', 'Stone'],
    images: [
      { url: 'https://images.unsplash.com/photo-1491553895911-0055eca6402d?auto=format&fit=crop&w=1200&q=80', altText: 'Minimal Flex Runner White', color: 'White' },
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', altText: 'Minimal Flex Runner Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?auto=format&fit=crop&w=1200&q=80', altText: 'Minimal Flex Runner Stone', color: 'Stone' }
    ],
    stock: 28,
    rating: 4.6,
    soldCount: 74,
    isActive: true
  },
  {
    name: 'Metro Court Classic',
    description: 'Everyday court sneaker with clean lines and a luxury streetwear finish.',
    price: 118,
    discount: 12,
    brand: 'I.Shoes',
    category: 'Sneakers',
    collection: 'Best Sellers',
    gender: 'men',
    sizes: [7, 8, 9, 10, 11, 12],
    colors: ['White', 'Black'],
    images: [
      { url: 'https://images.unsplash.com/photo-1607522370275-f14206abe5d3?auto=format&fit=crop&w=1200&q=80', altText: 'Metro Court Classic White', color: 'White' },
      { url: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?auto=format&fit=crop&w=1200&q=80', altText: 'Metro Court Classic Black', color: 'Black' }
    ],
    stock: 19,
    rating: 4.7,
    soldCount: 81,
    isActive: true
  },
  {
    name: 'Heritage Tassel Loafers',
    description: 'Refined formal loafers with soft leather and a polished finish.',
    price: 149,
    discount: 5,
    brand: 'I.Shoes',
    category: 'Formal Shoes',
    collection: 'Winter Collection',
    gender: 'men',
    sizes: [7, 8, 9, 10, 11],
    colors: ['Black', 'Wine'],
    images: [
      { url: 'https://images.unsplash.com/photo-1449505278894-297fdb3edbc1?auto=format&fit=crop&w=1200&q=80', altText: 'Heritage Tassel Loafers Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1200&q=80', altText: 'Heritage Tassel Loafers Wine', color: 'Wine' }
    ],
    stock: 14,
    rating: 4.4,
    soldCount: 39,
    isActive: true
  },
  {
    name: 'Everyday Cloud Slides',
    description: 'Cushioned sliders made for post-workout recovery and relaxed home wear.',
    price: 39,
    discount: 0,
    brand: 'I.Shoes',
    category: 'Slippers',
    collection: 'Summer Collection',
    gender: 'unisex',
    sizes: [6, 7, 8, 9, 10, 11, 12],
    colors: ['Black', 'Sand', 'Olive'],
    images: [
      { url: 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?auto=format&fit=crop&w=1200&q=80', altText: 'Everyday Cloud Slides Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1623998021261-1d4a1a1a07a8?auto=format&fit=crop&w=1200&q=80', altText: 'Everyday Cloud Slides Sand', color: 'Sand' },
      { url: 'https://images.unsplash.com/photo-1623998021261-1d4a1a1a07a8?auto=format&fit=crop&w=1200&q=80', altText: 'Everyday Cloud Slides Olive', color: 'Olive' }
    ],
    stock: 40,
    rating: 4.3,
    soldCount: 55,
    isActive: true
  },
  {
    name: 'Apex Trail Boot',
    description: 'Weather-ready boot with rugged traction and elevated outdoor styling.',
    price: 199,
    discount: 18,
    brand: 'I.Shoes',
    category: 'Boots',
    collection: 'Winter Collection',
    gender: 'unisex',
    sizes: [8, 9, 10, 11, 12, 13],
    colors: ['Black', 'Brown'],
    images: [
      { url: 'https://images.unsplash.com/photo-1460353581641-37baddab0fa2?auto=format&fit=crop&w=1200&q=80', altText: 'Apex Trail Boot Black', color: 'Black' },
      { url: 'https://images.unsplash.com/photo-1521145239580-2e5d0e8f29f6?auto=format&fit=crop&w=1200&q=80', altText: 'Apex Trail Boot Brown', color: 'Brown' }
    ],
    stock: 11,
    rating: 4.8,
    soldCount: 44,
    isActive: true
  }
];

export const seedInitialData = async () => {
  for (const product of sampleProducts) {
    const existingProduct = await Product.findOne({ name: product.name });

    if (existingProduct) {
      Object.assign(existingProduct, product);
      await existingProduct.save();
    } else {
      await Product.create(product);
    }
  }

  console.log(`✅ Sample products synced: ${sampleProducts.length}`);

  const adminEmail = process.env.ADMIN_EMAIL || 'admin@ishoes.com';
  const adminExists = await User.findOne({ email: adminEmail });
  if (!adminExists) {
    await User.create({
      email: adminEmail,
      password: process.env.ADMIN_PASSWORD || 'admin@123',
      firstName: 'Admin',
      lastName: 'User',
      role: 'admin'
    });
    console.log('✅ Admin user seeded');
  }
};

export default seedInitialData;
