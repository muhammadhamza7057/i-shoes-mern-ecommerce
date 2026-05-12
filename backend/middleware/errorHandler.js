import { APP_CONSTANTS } from '../config/constants.js';

/**
 * Global error handler middleware
 */
export const errorHandler = (err, req, res, next) => {
  console.error('Error:', {
    message: err.message,
    status: err.status || 500,
    path: req.path,
    method: req.method
  });

  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const messages = Object.values(err.errors)
      .map(error => error.message)
      .join(', ');

    return res.status(APP_CONSTANTS.HTTP_CODES.BAD_REQUEST).json({
      success: false,
      message: APP_CONSTANTS.ERRORS.VALIDATION_ERROR,
      details: messages
    });
  }

  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyPattern)[0];
    return res.status(APP_CONSTANTS.HTTP_CODES.CONFLICT).json({
      success: false,
      message: `${field} already exists`,
      details: err.message
    });
  }

  // Custom error with status code
  if (err.status) {
    return res.status(err.status).json({
      success: false,
      message: err.message,
      ...(process.env.NODE_ENV === 'development' && { details: err })
    });
  }

  // Default server error
  res.status(APP_CONSTANTS.HTTP_CODES.SERVER_ERROR).json({
    success: false,
    message: APP_CONSTANTS.ERRORS.SERVER_ERROR,
    ...(process.env.NODE_ENV === 'development' && { 
      error: err.message,
      stack: err.stack 
    })
  });
};

/**
 * Create custom error
 */
export const createError = (message, status = 500) => {
  const error = new Error(message);
  error.status = status;
  return error;
};

export default errorHandler;
