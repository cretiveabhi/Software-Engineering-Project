// Krishi Sarathi - Axios API Client
import axios from 'axios';

const api = axios.create({
  baseURL: '/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Attach Authorization token to requests if present
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ks_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response error handler
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Clear token if expired or unauthorized
      const currentPath = window.location.pathname;
      if (currentPath !== '/login' && currentPath !== '/register' && currentPath !== '/') {
        localStorage.removeItem('ks_token');
        localStorage.removeItem('ks_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;
