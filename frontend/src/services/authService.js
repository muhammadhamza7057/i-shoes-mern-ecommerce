import api from './api';

// Auth APIs
export const authService = {
  register: async (userData) => {
    const response = await api.post('/auth/register', {
      name: [userData.firstName, userData.lastName].filter(Boolean).join(' '),
      email: userData.email,
      password: userData.password,
      phone: userData.phone || '',
    });

    return {
      user: response.data?.user,
      token: response.data?.accessToken,
    };
  },
  login: async (credentials) => {
    const response = await api.post('/auth/login', credentials);

    return {
      user: response.data?.user,
      token: response.data?.accessToken,
    };
  },
  me: async () => {
    const response = await api.get('/auth/me');
    return response.data?.user;
  },
  logout: () => {
    localStorage.removeItem('ishoes_token');
    localStorage.removeItem('ishoes_user');
  }
};

export default authService;
