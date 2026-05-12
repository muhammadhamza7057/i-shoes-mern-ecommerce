import axios from 'axios';
import { APP_CONSTANTS } from '../utils/constants';

// Create axios instance
const api = axios.create({
  baseURL: APP_CONSTANTS.API_BASE_URL,
  timeout: APP_CONSTANTS.API_TIMEOUT,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor - add token to headers
api.interceptors.request.use(
  config => {
    const token = localStorage.getItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => {
    return Promise.reject(error);
  }
);

// Response interceptor - handle errors globally
api.interceptors.response.use(
  response => response.data,
  error => {
    if (error.response?.status === 401) {
      // Token expired or unauthorized
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.TOKEN);
      localStorage.removeItem(APP_CONSTANTS.STORAGE_KEYS.USER);
      window.location.href = APP_CONSTANTS.ROUTES.LOGIN;
    }
    return Promise.reject(error.response?.data || error.message);
  }
);

export default api;
