import pino from 'pino';
import { env } from '../config/env.js';

const logger = pino({
  level: env.isProduction ? 'info' : 'debug',
  transport: env.isProduction
    ? undefined
    : { target: 'pino/file', options: { destination: 1 } },
});

export default logger;
