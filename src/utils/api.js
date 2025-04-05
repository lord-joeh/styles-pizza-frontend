import axios from 'axios';

// Create axios instance with default configuration
const api = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || 'http://localhost:5000/api/v1',
  withCredentials: true,
  timeout: 10000, // 10 seconds timeout
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});

// Request interceptor for adding authorization token and handling errors
api.interceptors.request.use(
  async (config) => {
    // Skip token addition for auth routes
    const authRoutes = ['/login', '/register', '/refresh-token'];
    if (authRoutes.some((route) => config.url?.includes(route))) {
      return config;
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
      switch (error.response.status) {
        case 404:
          window.location.href = '/not-found';
          break;
        // Extend here for other statuses like 500 if needed
        default:
          break;
      }
    }

    return Promise.reject(error);
  },
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
