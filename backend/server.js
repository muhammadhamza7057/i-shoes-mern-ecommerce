import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import helmet from 'helmet';
import morgan from 'morgan';
import dotenv from 'dotenv';
import rateLimit from 'express-rate-limit';

// Import configuration
import connectDB from './config/db.js';
import { envConfig } from './config/env.js';
import { logger } from './utils/logger.js';
import { seedInitialData } from './utils/seedInitialData.js';

// Import middleware
import { errorHandler } from './middleware/errorHandler.js';

// Import routes
import authRoutes from './routes/auth.js';
import productRoutes from './routes/products.js';
import userRoutes from './routes/users.js';
import orderRoutes from './routes/orders.js';
import cartRoutes from './routes/cart.js';
import paymentRoutes from './routes/payments.js';

// Load environment variables
dotenv.config();

// Initialize Express app
const app = express();

// Security middleware
app.use(helmet());
app.use(cors({
  origin: envConfig.CORS_ORIGIN,
  credentials: true
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
app.use(limiter);

// Request parsing
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Logging
app.use(morgan('dev'));

// Connect to database
const initializeDB = async () => {
  try {
    await connectDB();
    logger.success('Database initialized and models registered');
    await seedInitialData();
  } catch (error) {
    logger.error('Database initialization failed:', error.message);
    process.exit(1);
  }
};

initializeDB();

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'success',
    message: 'I.Shoes API is running',
    environment: envConfig.NODE_ENV,
    timestamp: new Date().toISOString()
  });
});

// Database status endpoint
app.get('/api/db-status', async (req, res) => {
  try {
    const mongooseConnection = mongoose.connection;
    const status = mongooseConnection.readyState;
    
    res.status(200).json({
      status: 'success',
      database: {
        connected: status === 1,
        name: mongooseConnection.name || 'ishoes_db',
        host: mongooseConnection.host || 'localhost'
      }
    });
  } catch (error) {
    res.status(500).json({
      status: 'error',
      message: 'Database status check failed'
    });
  }
});

// API Routes (to be implemented in Step 3)
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/users', userRoutes);
app.use('/api/orders', orderRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/payments', paymentRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found',
    path: req.path,
    method: req.method
  });
});

// Global error handler (must be last)
app.use(errorHandler);

// Start server
const PORT = envConfig.PORT;
const server = app.listen(PORT, () => {
  logger.success(`
╔════════════════════════════════════════╗
║       I.SHOES BACKEND API READY        ║
╠════════════════════════════════════════╣
║ 🚀 Server running on port ${PORT}${' '.repeat(27 - PORT.toString().length)}║
║ 📊 Environment: ${envConfig.NODE_ENV.padEnd(26)}║
║ 🌐 CORS Origin: ${envConfig.CORS_ORIGIN.padEnd(21)}║
║ 💾 Database: ishoes_db${' '.repeat(21)}║
╚════════════════════════════════════════╝
  `);
});

// Handle graceful shutdown
process.on('SIGTERM', () => {
  logger.warning('SIGTERM signal received: closing HTTP server');
  server.close(() => {
    logger.success('HTTP server closed');
    process.exit(0);
  });
});

process.on('SIGINT', () => {
  logger.warning('SIGINT signal received: closing HTTP server');
  server.close(() => {
    logger.success('HTTP server closed');
    process.exit(0);
  });
});

export default app;
