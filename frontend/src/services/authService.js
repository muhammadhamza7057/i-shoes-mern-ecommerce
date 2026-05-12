import api from './api';

// Auth APIs
export const authService = {
  register: (userData) => api.post('/auth/register', userData),
  login: (credentials) => api.post('/auth/login', credentials),
  me: () => api.get('/auth/me'),
  logout: () => {
    localStorage.removeItem('ishoes_token');
    localStorage.removeItem('ishoes_user');
  }
};

export default authService;
