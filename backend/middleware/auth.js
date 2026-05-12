import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.js';
import { APP_CONSTANTS } from '../config/constants.js';

/**
 * Verify JWT token middleware
 */
export const authenticate = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (!token) {
      return res.status(APP_CONSTANTS.HTTP_CODES.UNAUTHORIZED).json({
        success: false,
        message: APP_CONSTANTS.ERRORS.UNAUTHORIZED
      });
    }

    const decoded = jwt.verify(token, envConfig.JWT_SECRET);
    req.user = decoded;
    next();
  } catch (error) {
    return res.status(APP_CONSTANTS.HTTP_CODES.UNAUTHORIZED).json({
      success: false,
      message: error.message === 'jwt expired' ? APP_CONSTANTS.ERRORS.TOKEN_EXPIRED : APP_CONSTANTS.ERRORS.UNAUTHORIZED
    });
  }
};

/**
 * Admin authorization middleware
 */
export const authorize = (req, res, next) => {
  if (req.user?.role !== APP_CONSTANTS.ROLES.ADMIN) {
    return res.status(APP_CONSTANTS.HTTP_CODES.FORBIDDEN).json({
      success: false,
      message: APP_CONSTANTS.ERRORS.FORBIDDEN
    });
  }
  next();
};

/**
 * Optional authentication (doesn't fail if no token)
 */
export const authenticateOptional = (req, res, next) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, envConfig.JWT_SECRET);
      req.user = decoded;
    }
  } catch (error) {
    // Silently ignore auth errors for optional auth
  }

  next();
};

export default authenticate;
