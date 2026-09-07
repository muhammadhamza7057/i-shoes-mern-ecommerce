import jwt from 'jsonwebtoken';
import { env } from '../config/env.js';
import ApiError from '../utils/ApiError.js';
import { users as User } from '../repositories/index.js';

export const authenticate = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next(ApiError.unauthorized('Access token required'));
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    const user = await User.findById(payload.sub);

    if (!user || !user.isActive) {
      next(ApiError.unauthorized('Invalid or inactive account'));
      return;
    }

    req.user = user;
    next();
  } catch {
    next(ApiError.unauthorized('Invalid or expired access token'));
  }
};

export const optionalAuth = async (req, res, next) => {
  const authHeader = req.headers.authorization;
  const token = authHeader?.startsWith('Bearer ') ? authHeader.slice(7) : null;

  if (!token) {
    next();
    return;
  }

  try {
    const payload = jwt.verify(token, env.jwt.accessSecret);
    const user = await User.findById(payload.sub);
    if (user?.isActive) req.user = user;
  } catch {
    // ignore invalid token for optional auth
  }

  next();
};

export default authenticate;
