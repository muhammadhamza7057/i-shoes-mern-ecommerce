import app from './app.js';
import connectDB from './config/db.js';
import { env } from './config/env.js';
import logger from './utils/logger.js';

const start = async () => {
  await connectDB();

  app.listen(env.port, () => {
    logger.info({ port: env.port, env: env.nodeEnv }, 'Server started');
  });
};

start().catch((err) => {
  logger.error(err, 'Failed to start server');
  process.exit(1);
});
