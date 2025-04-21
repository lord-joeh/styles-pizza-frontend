import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 15000, // 15 seconds timeout for better reliability
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  // Enable request retries for better reliability
  retry: 2,
  retryDelay: (retryCount) => retryCount * 1000,
  // Enable response compression
  decompress: true,
});

// Request interceptor for adding authorization token and handling errors
api.interceptors.request.use(
  async (config) => {
    // Skip token addition for auth routes
    const authRoutes = ['/login', '/register', '/refresh-token', '/forgot-password', '/reset-password'];
    if (authRoutes.some((route) => config.url?.includes(route))) {
      return config;
    }

    // Add cache control headers for GET requests
    if (config.method === 'get') {
      config.headers['Cache-Control'] = 'no-cache';
      config.headers['Pragma'] = 'no-cache';
    }

    try {
      const userData = localStorage.getItem('user');
      if (userData) {
        const user = JSON.parse(userData);
        if (user?.token) {
          config.headers.Authorization = `Bearer ${user.token}`;
        }
      }
    } catch (error) {
      console.error('Failed to parse user data:', error);
      localStorage.removeItem('user');
      window.location.href = '/login'; // Redirect to login on invalid token
      return Promise.reject(error);
    }

    return config;
  },
  (error) => Promise.reject(error),
);

// Response interceptor for handling errors globally and token refresh
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Handle token expiration (401) and attempt refresh if not already retried
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Refresh token request (bypassing interceptors by using axios.post directly)
        const response = await axios.post(
          `${process.env.REACT_APP_API_BASE_URL}/refresh-token`,
          {},
          { withCredentials: true },
        );

        const { token } = response.data;
        const user = JSON.parse(localStorage.getItem('user'));
        localStorage.setItem('user', JSON.stringify({ ...user, token }));

        // Update token in default headers and original request headers
        api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
        originalRequest.headers['Authorization'] = `Bearer ${token}`;

        return api(originalRequest);
      } catch (refreshError) {
        // If token refresh fails, clear storage and redirect to login
        localStorage.removeItem('user');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Global error handling for other status codes
    if (error.response) {
      const status = error.response.status;
      switch (status) {
        case 400:
          console.error('Bad Request:', error.response.data);
          break;
        case 403:
          console.error('Forbidden:', error.response.data);
          window.location.href = '/forbidden';
          break;
        case 404:
          window.location.href = '/not-found';
          break;
        case 429:
          console.error('Rate limit exceeded');
          // Implement exponential backoff
          await new Promise(resolve => setTimeout(resolve, 1000 * Math.pow(2, originalRequest._retryCount || 0)));
          return api(originalRequest);
        case 500:
          console.error('Server Error:', error.response.data);
          break;
        default:
          if (status >= 500) {
            console.error('Server Error:', error.response.data);
          }
    }

    return Promise.reject(error);
  }},
);

// Development logging for requests and responses
if (process.env.NODE_ENV === 'development') {
  api.interceptors.request.use((request) => {
    console.log('Starting Request', request);
    return request;
  });
  api.interceptors.response.use((response) => {
    console.log('Response:', response);
    return response;
  });
}

export default api;
