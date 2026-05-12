/**
 * Environment Configuration
 */
export const envConfig = {
  // Server
  PORT: process.env.PORT || 5000,
  NODE_ENV: process.env.NODE_ENV || 'development',

  // Database
  MONGODB_URI: process.env.MONGODB_URI || 'mongodb://localhost:27017/ishoes_db',

  // JWT
  JWT_SECRET: process.env.JWT_SECRET || 'your_jwt_secret_key',
  JWT_EXPIRY: process.env.JWT_EXPIRY || '7d',

  // CORS
  CORS_ORIGIN: process.env.CORS_ORIGIN || 'http://localhost:5173',

  // Stripe
  STRIPE_SECRET_KEY: process.env.STRIPE_SECRET_KEY || '',
  STRIPE_PUBLISHABLE_KEY: process.env.STRIPE_PUBLISHABLE_KEY || '',

  // Email
  EMAIL_SERVICE: process.env.EMAIL_SERVICE || 'gmail',
  EMAIL_USER: process.env.EMAIL_USER || '',
  EMAIL_PASSWORD: process.env.EMAIL_PASSWORD || '',

  // Admin
  ADMIN_EMAIL: process.env.ADMIN_EMAIL || 'admin@ishoes.com',
  ADMIN_PASSWORD: process.env.ADMIN_PASSWORD || 'admin@123',

  // API
  API_URL: process.env.API_URL || 'http://localhost:5000/api',

  // Check if in production
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV === 'development'
};

export default envConfig;
