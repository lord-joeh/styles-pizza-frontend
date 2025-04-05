import api from '../utils/api';

export const registerUser = async (userData) => {
  try {
    const response = await api.post('/users/register', userData);
    if (!response.data?.user) {
      throw new Error('Registration failed - no user data returned');
    }
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Registration failed. Please try again.';
    throw new Error(message);
  }
};

export const verifyEmail = async (token) => {
  try {
    const response = await api.get('/users/verify-email', {
      params: { token },
    });
    if (!response.data?.success) {
      throw new Error('Email verification failed');
    }
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Email verification failed. Please try again.';
    throw new Error(message);
  }
};

export const loginUser = async (email, password) => {
  try {
    const response = await api.post('/users/login', { email, password });
    if (!response.data?.accessToken) {
      throw new Error('Invalid server response');
    }

    return {
      ...response.data.user,
      isAdmin: response.data.user.role === 'admin',
      token: response.data.accessToken,
      refreshToken: response.data.refreshToken,
    };
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Login failed. Please try again.';
    throw new Error(message);
  }
};

export const forgotPassword = async (email) => {
  try {
    const response = await api.post('/users/forgot-password', { email });
    if (!response.data?.success) {
      throw new Error('Failed to send reset email');
    }
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Failed to send reset email. Please try again.';
    throw new Error(message);
  }
};

export const resetPassword = async (token, newPassword) => {
  try {
    const response = await api.post('/users/reset-password', {
      token,
      newPassword,
    });
    if (!response.data?.success) {
      throw new Error('Password reset failed');
    }
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error ||
      error.message ||
      'Password reset failed. Please try again.';
    throw new Error(message);
  }
};

export const getProfile = async () => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.get('/users/profile', {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Failed to fetch profile';
    throw new Error(message);
  }
};

export const updateProfile = async (userData) => {
  try {
    const token = localStorage.getItem('token');
    const response = await api.put('/users/profile', userData, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Profile update failed';
    throw new Error(message);
  }
};

export const logout = async () => {
  try {
    const response = await api.post('/users/logout');
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Logout failed';
    throw new Error(message);
  }
};

export const refreshToken = async (refreshToken) => {
  try {
    const response = await api.post('/users/refresh-token', { refreshToken });
    return response.data;
  } catch (error) {
    const message =
      error.response?.data?.error || error.message || 'Token refresh failed';
    throw new Error(message);
  }
};
