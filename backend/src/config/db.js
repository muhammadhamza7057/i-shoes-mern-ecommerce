import { verifySupabaseConnection } from './supabase.js';
import logger from '../utils/logger.js';

export const connectDB = async () => {
  await verifySupabaseConnection();
  logger.info('Supabase connected');
};

export default connectDB;
