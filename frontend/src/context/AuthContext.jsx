import { createContext, useContext, useState, useEffect } from 'react';
import authService from '../services/authService';

const AuthContext = createContext(null);

/**
 * AuthProvider — manages authentication state
 * Stores token in localStorage, auto-loads user on mount
 */
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  // Load user from token on mount
  useEffect(() => {
    const loadUser = async () => {
      const token = localStorage.getItem('lms_token');
      if (token) {
        try {
          const res = await authService.getMe();
          setUser(res.data);
        } catch (error) {
          // Token expired or invalid
          localStorage.removeItem('lms_token');
          localStorage.removeItem('lms_user');
          setUser(null);
        }
      }
      setLoading(false);
    };
    loadUser();
  }, []);

  // Login
  const login = async (email, password) => {
    const res = await authService.login({ email, password });
    if (res.success) {
      localStorage.setItem('lms_token', res.data.token);
      localStorage.setItem('lms_user', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res;
  };

  // Register
  const register = async (name, email, password, role) => {
    const res = await authService.register({ name, email, password, role });
    if (res.success) {
      localStorage.setItem('lms_token', res.data.token);
      localStorage.setItem('lms_user', JSON.stringify(res.data));
      setUser(res.data);
    }
    return res;
  };

  // Logout
  const logout = () => {
    localStorage.removeItem('lms_token');
    localStorage.removeItem('lms_user');
    setUser(null);
  };

  // Update user in context (after profile edit)
  const updateUser = (updatedData) => {
    setUser((prev) => ({ ...prev, ...updatedData }));
    localStorage.setItem('lms_user', JSON.stringify({ ...user, ...updatedData }));
  };

  return (
    <AuthContext.Provider
      value={{ user, loading, login, register, logout, updateUser }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// Custom hook for easy access
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;
