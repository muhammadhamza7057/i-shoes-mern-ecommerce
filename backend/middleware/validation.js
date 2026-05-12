import { body, validationResult, param, query } from 'express-validator';
import { APP_CONSTANTS } from '../config/constants.js';

/**
 * Middleware to handle validation errors
 */
export const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(APP_CONSTANTS.HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: APP_CONSTANTS.ERRORS.VALIDATION_ERROR,
      errors: errors.array().map(err => ({
        field: err.param,
        message: err.msg
      }))
    });
  }

  next();
};

/**
 * Auth validation rules
 */
export const authValidationRules = () => [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long'),

  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
];

/**
 * Product validation rules
 */
export const productValidationRules = () => [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Product name is required')
    .isLength({ min: 3 })
    .withMessage('Product name must be at least 3 characters'),

  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 10 })
    .withMessage('Description must be at least 10 characters'),

  body('price')
    .isFloat({ min: 0 })
    .withMessage('Price must be a positive number'),

  body('discount')
    .optional()
    .isFloat({ min: 0, max: 100 })
    .withMessage('Discount must be between 0 and 100'),

  body('collection')
    .optional()
    .custom((value) => {
      if (typeof value === 'string') return true;
      if (value && typeof value === 'object' && (value.name || value.value || value.label)) return true;
      throw new Error('Collection must be a string or an object with a name');
    }),

  body('brand')
    .trim()
    .notEmpty()
    .withMessage('Brand is required'),

  body('category')
    .isIn(APP_CONSTANTS.CATEGORIES)
    .withMessage(`Category must be one of: ${APP_CONSTANTS.CATEGORIES.join(', ')}`),

  body('gender')
    .isIn(APP_CONSTANTS.GENDERS)
    .withMessage(`Gender must be one of: ${APP_CONSTANTS.GENDERS.join(', ')}`),

  body('sizes')
    .custom((value) => Array.isArray(value) || typeof value === 'string')
    .withMessage('At least one size is required'),

  body('colors')
    .custom((value) => Array.isArray(value) || typeof value === 'string')
    .withMessage('At least one color is required'),

  // Images are optional — no strict color-image pairing enforced at validation layer
  // (the frontend ProductForm provides a soft warning instead)
  body('images').optional(),

  body('stock')
    .isInt({ min: 0 })
    .withMessage('Stock must be a non-negative integer')
];

/**
 * Order validation rules
 */
export const orderValidationRules = () => [
  body('items')
    .isArray({ min: 1 })
    .withMessage('Order must contain at least one item'),

  body('paymentMethod')
    .isIn(Object.values(APP_CONSTANTS.PAYMENT_METHODS))
    .withMessage(`Payment method must be one of: ${Object.values(APP_CONSTANTS.PAYMENT_METHODS).join(', ')}`),

  body('shippingAddress.firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required'),

  body('shippingAddress.lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required'),

  body('shippingAddress.email')
    .isEmail()
    .withMessage('Valid email is required'),

  body('shippingAddress.phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),

  body('shippingAddress.street')
    .trim()
    .notEmpty()
    .withMessage('Street address is required'),

  body('shippingAddress.city')
    .trim()
    .notEmpty()
    .withMessage('City is required'),

  body('shippingAddress.state')
    .trim()
    .notEmpty()
    .withMessage('State is required'),

  body('shippingAddress.postalCode')
    .trim()
    .notEmpty()
    .withMessage('Postal code is required'),

  body('shippingAddress.country')
    .trim()
    .notEmpty()
    .withMessage('Country is required')
];

/**
 * Login validation rules
 */
export const loginValidationRules = () => [
  body('email')
    .isEmail()
    .normalizeEmail()
    .withMessage('Please provide a valid email'),

  body('password')
    .notEmpty()
    .withMessage('Password is required')
];

export default {
  handleValidationErrors,
  authValidationRules,
  productValidationRules,
  orderValidationRules,
  loginValidationRules
};
