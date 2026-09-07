import { ZodError } from 'zod';
import ApiError from '../utils/ApiError.js';

export const validate = (schema, source = 'body') => (req, res, next) => {
  try {
    const parsed = schema.parse(req[source]);
    req[source] = parsed;
    next();
  } catch (err) {
    if (err instanceof ZodError) {
      const details = err.errors.map((e) => ({
        field: e.path.join('.') || source,
        message: e.message,
      }));
      next(ApiError.badRequest('Validation failed', details));
      return;
    }
    next(err);
  }
};

export default validate;
