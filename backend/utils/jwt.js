import jwt from 'jsonwebtoken';
import { envConfig } from '../config/env.js';

/**
 * Generate JWT token
 */
export const generateToken = (userId, role = 'user') => {
  return jwt.sign(
    { id: userId, role },
    envConfig.JWT_SECRET,
    { expiresIn: envConfig.JWT_EXPIRY }
  );
};

/**
 * Verify JWT token
 */
export const verifyToken = (token) => {
  try {
    return jwt.verify(token, envConfig.JWT_SECRET);
  } catch (error) {
    return null;
  }
};

/**
 * Decode JWT token without verification
 */
export const decodeToken = (token) => {
  return jwt.decode(token);
};

export default {
  generateToken,
  verifyToken,
  decodeToken
};
