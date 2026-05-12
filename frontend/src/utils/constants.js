export const APP_CONSTANTS = {
  // Brand
  APP_NAME: 'I.Shoes',
  APP_TAGLINE: 'Premium Shoes E-Commerce Platform',
  
  // Colors
  COLORS: {
    PRIMARY: '#0B0B0B',
    ACCENT: '#00FF88',
    SECONDARY: '#F5F5F5',
    NEUTRAL: '#1A1A1A',
  },
  
  // API
  API_BASE_URL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  API_TIMEOUT: 30000,
  
  // Pagination
  ITEMS_PER_PAGE: 12,
  
  // Product categories
  CATEGORIES: [
    'Sneakers',
    'Formal Shoes',
    'Slippers',
    'Sports Shoes',
    'Boots'
  ],
  
  // Collections
  COLLECTIONS: [
    { name: 'Summer Collection', icon: 'sun' },
    { name: 'Winter Collection', icon: 'snow' },
    { name: 'New Arrivals', icon: 'spark' },
    { name: 'Best Sellers', icon: 'star' }
  ],
  
  // Gender — must match backend enum values exactly
  GENDERS: ['men', 'women', 'unisex'],

  // Common color options used in product selectors
  COLOR_OPTIONS: [
    { name: 'Black', hex: '#111111' },
    { name: 'White', hex: '#F8F8F8' },
    { name: 'Grey', hex: '#9CA3AF' },
    { name: 'Red', hex: '#EF4444' },
    { name: 'Blue', hex: '#3B82F6' },
    { name: 'Green', hex: '#10B981' },
    { name: 'Brown', hex: '#8B5E3C' },
    { name: 'Tan', hex: '#D6A45C' },
    { name: 'Sand', hex: '#C8B38C' },
    { name: 'Olive', hex: '#6B8E23' },
    { name: 'Wine', hex: '#7B1E3A' },
    { name: 'Stone', hex: '#D6D3D1' },
    { name: 'Neon Green', hex: '#00FF88' }
  ],
  
  // Shoe sizes
  SHOE_SIZES: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],
  
  // Filter options
  PRICE_RANGES: [
    { label: 'Under $50', min: 0, max: 50 },
    { label: '$50 - $100', min: 50, max: 100 },
    { label: '$100 - $200', min: 100, max: 200 },
    { label: 'Above $200', min: 200, max: Infinity }
  ],
  
  // Routes
  ROUTES: {
    HOME: '/',
    PRODUCTS: '/products',
    PRODUCT_DETAIL: '/products/:id',
    CART: '/cart',
    CHECKOUT: '/checkout',
    LOGIN: '/login',
    REGISTER: '/register',
    ORDER_HISTORY: '/orders',
    ADMIN_DASHBOARD: '/admin',
    ADMIN_PRODUCTS: '/admin/products',
    ADMIN_ORDERS: '/admin/orders',
    ADMIN_USERS: '/admin/users',
    NOT_FOUND: '*'
  },
  
  // Storage keys
  STORAGE_KEYS: {
    TOKEN: 'ishoes_token',
    USER: 'ishoes_user',
    CART: 'ishoes_cart',
    WISHLIST: 'ishoes_wishlist',
    THEME: 'ishoes_theme',
    RECENTLY_VIEWED: 'ishoes_recently_viewed'
  },
  
  // Animation durations (ms)
  ANIMATIONS: {
    FAST: 200,
    NORMAL: 300,
    SLOW: 500,
    VERY_SLOW: 800
  },
  
  // Messages
  MESSAGES: {
    SUCCESS_ADD_TO_CART: 'Added to cart!',
    SUCCESS_REMOVE_FROM_CART: 'Removed from cart',
    SUCCESS_LOGIN: 'Login successful!',
    SUCCESS_REGISTER: 'Registration successful! Please login.',
    SUCCESS_ORDER: 'Order placed successfully!',
    ERROR_GENERIC: 'Something went wrong. Please try again.',
    ERROR_LOGIN: 'Invalid email or password',
    ERROR_REGISTER: 'Registration failed. Please try again.',
    ERROR_NETWORK: 'Network error. Please check your connection.',
    ERROR_UNAUTHORIZED: 'Please login to continue',
    LOADING: 'Loading...'
  }
};

export default APP_CONSTANTS;
