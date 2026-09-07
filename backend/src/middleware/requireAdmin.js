import ApiError from '../utils/ApiError.js';

export const requireAdmin = (req, res, next) => {
  if (!req.user) {
    next(ApiError.unauthorized());
    return;
  }

  if (req.user.role !== 'admin') {
    next(ApiError.forbidden('Admin access required'));
    return;
  }

  next();
};

export default requireAdmin;
