/**
 * Application Constants
 */
export const APP_CONSTANTS = {
  // HTTP Status
  HTTP_CODES: {
    OK: 200,
    CREATED: 201,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    CONFLICT: 409,
    SERVER_ERROR: 500,
    SERVICE_UNAVAILABLE: 503
  },

  // User Roles
  ROLES: {
    USER: 'user',
    ADMIN: 'admin'
  },

  // Product Categories
  CATEGORIES: [
    'Sneakers',
    'Formal Shoes',
    'Slippers',
    'Sports Shoes',
    'Boots'
  ],

  // Product Collections
  COLLECTIONS: [
    'Summer Collection',
    'Winter Collection',
    'New Arrivals',
    'Best Sellers'
  ],

  // Gender Options
  GENDERS: ['men', 'women', 'unisex'],

  // Order Status
  ORDER_STATUS: {
    PENDING: 'pending',
    PROCESSING: 'processing',
    SHIPPED: 'shipped',
    DELIVERED: 'delivered',
    CANCELLED: 'cancelled'
  },

  // Payment Status
  PAYMENT_STATUS: {
    PENDING: 'pending',
    COMPLETED: 'completed',
    FAILED: 'failed',
    REFUNDED: 'refunded'
  },

  // Payment Methods
  PAYMENT_METHODS: {
    STRIPE: 'stripe',
    COD: 'cod' // Cash on Delivery
  },

  // Size ranges
  SHOE_SIZES: [6, 7, 8, 9, 10, 11, 12, 13, 14, 15],

  // Error Messages
  ERRORS: {
    UNAUTHORIZED: 'Unauthorized access',
    FORBIDDEN: 'Access forbidden',
    NOT_FOUND: 'Resource not found',
    VALIDATION_ERROR: 'Validation error',
    SERVER_ERROR: 'Internal server error',
    DUPLICATE_ENTRY: 'Entry already exists',
    INVALID_CREDENTIALS: 'Invalid email or password',
    TOKEN_EXPIRED: 'Token has expired'
  },

  // Success Messages
  SUCCESS: {
    CREATED: 'Resource created successfully',
    UPDATED: 'Resource updated successfully',
    DELETED: 'Resource deleted successfully',
    LOGIN: 'Login successful',
    REGISTER: 'Registration successful'
  }
};

export default APP_CONSTANTS;
