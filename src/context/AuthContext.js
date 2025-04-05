import React, {
  createContext,
  useState,
  useEffect,
  useCallback,
  useMemo,
} from 'react';
import { useNavigate } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Check if the JWT token is valid by decoding and comparing the expiration time
  const isTokenValid = useCallback((token) => {
    if (!token) return false;
    try {
      const { exp } = jwtDecode(token);
      return exp * 1000 > Date.now();
    } catch (e) {
      console.error('Token validation error:', e);
      return false;
    }
  }, []);

  // Clear stored authentication data
  const clearAuthData = useCallback(() => {
    localStorage.removeItem('user');
    localStorage.removeItem('token');
  }, []);

  // Logout function: clear user state, remove storage, and redirect to /login
  const logout = useCallback(() => {
    setUser(null);
    clearAuthData();
    setTimeout(() => navigate('/login'), 0);
  }, [navigate, clearAuthData]);

  // Initialize auth state from localStorage on component mount
  useEffect(() => {
    const initializeAuth = () => {
      try {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token && isTokenValid(token)) {
          setUser(JSON.parse(storedUser));
        } else {
          clearAuthData();
        }
      } catch (e) {
        console.error('Auth initialization error:', e);
        clearAuthData();
      } finally {
        setLoading(false);
      }
    };

    initializeAuth();
  }, [isTokenValid, clearAuthData]);

  // Token expiration watchdog that logs out the user if the token is expired
  useEffect(() => {
    if (!user?.token) return;

    const checkTokenValidity = () => {
      if (!isTokenValid(user.token)) {
        logout();
      }
    };

    const interval = setInterval(checkTokenValidity, 60000); // Check every minute
    return () => clearInterval(interval);
  }, [user?.token, isTokenValid, logout]);

  // Login function to update auth state and store user data locally
  const login = useCallback(
    async (userData) => {
      try {
        const mergedUser = {
          ...user, // Existing user data
          ...userData, // New data
          token: userData.token || user?.token, // Preserve token
        };

        if (!mergedUser.token) throw new Error('Token required');
        if (!isTokenValid(mergedUser.token)) throw new Error('Session expired');

        setUser(mergedUser);
        localStorage.setItem('user', JSON.stringify(mergedUser));
        localStorage.setItem('token', mergedUser.token);
        return true;
      } catch (error) {
        console.error('Login error:', error.message);
        clearAuthData();
        throw error;
      }
    },
    [isTokenValid, user],
  );

  // Memoize the context value to optimize performance
  const contextValue = useMemo(
    () => ({
      user,
      login,
      logout,
      isAuthenticated: !!user && isTokenValid(user?.token),
      loading,
    }),
    [user, loading, login, logout, isTokenValid],
  );

  return (
    <AuthContext.Provider value={contextValue}>{children}</AuthContext.Provider>
  );
};
