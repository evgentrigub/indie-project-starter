import axios from 'axios';

const baseURL = typeof window !== 'undefined' ? (import.meta.env.VITE_API_URL || '/api') : '/api';

// Create axios instance with default config
export const apiService = axios.create({
  baseURL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include auth token
apiService.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Add response interceptor to handle common errors
apiService.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    const status = error.response?.status;
    
    // Handle authentication errors
    if (status === 401) {
      // Clear token and redirect to login if unauthorized
      localStorage.removeItem('token');
      
      // Avoid redirecting if already on login page
      if (window.location.pathname !== '/login') {
        window.location.href = '/login';
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiService; 