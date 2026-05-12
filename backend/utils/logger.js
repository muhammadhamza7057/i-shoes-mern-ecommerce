/**
 * Logger utility for development and production
 */

const colors = {
  reset: '\x1b[0m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  gray: '\x1b[90m'
};

export const logger = {
  info: (message, data = null) => {
    console.log(`${colors.blue}[INFO]${colors.reset} ${message}`, data || '');
  },

  success: (message, data = null) => {
    console.log(`${colors.green}[SUCCESS]${colors.reset} ${message}`, data || '');
  },

  warning: (message, data = null) => {
    console.warn(`${colors.yellow}[WARNING]${colors.reset} ${message}`, data || '');
  },

  error: (message, data = null) => {
    console.error(`${colors.red}[ERROR]${colors.reset} ${message}`, data || '');
  },

  debug: (message, data = null) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`${colors.gray}[DEBUG]${colors.reset} ${message}`, data || '');
    }
  },

  request: (method, path, statusCode) => {
    const methodColor =
      method === 'GET' ? colors.blue :
      method === 'POST' ? colors.green :
      method === 'PATCH' ? colors.yellow :
      method === 'DELETE' ? colors.red : colors.cyan;

    const statusColor = statusCode < 300 ? colors.green : statusCode < 400 ? colors.blue : colors.red;

    console.log(
      `${methodColor}[${method}]${colors.reset} ${path} ${statusColor}${statusCode}${colors.reset}`
    );
  }
};

export default logger;
