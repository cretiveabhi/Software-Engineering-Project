import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api.js';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    try {
      const stored = localStorage.getItem('ks_user');
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState(() => localStorage.getItem('ks_token') || null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  // Sync session on mount
  useEffect(() => {
    async function checkAuth() {
      if (token) {
        try {
          const res = await api.get('/auth/me');
          if (res.data.success && res.data.user) {
            setUser(res.data.user);
            localStorage.setItem('ks_user', JSON.stringify(res.data.user));
          }
        } catch (err) {
          console.warn('Session verification failed, logging out.');
          logout();
        }
      }
    }
    checkAuth();
  }, [token]);

  const login = async (email, password) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/login', { email, password });
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('ks_token', token);
        localStorage.setItem('ks_user', JSON.stringify(user));
        return { success: true, user };
      }
      throw new Error(res.data.message || 'Login failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Login failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const register = async (farmerData) => {
    setLoading(true);
    setError(null);
    try {
      const res = await api.post('/auth/register', farmerData);
      if (res.data.success) {
        const { token, user } = res.data;
        setToken(token);
        setUser(user);
        localStorage.setItem('ks_token', token);
        localStorage.setItem('ks_user', JSON.stringify(user));
        return { success: true, user };
      }
      throw new Error(res.data.message || 'Registration failed');
    } catch (err) {
      const msg = err.response?.data?.message || err.message || 'Registration failed';
      setError(msg);
      return { success: false, message: msg };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem('ks_token');
    localStorage.removeItem('ks_user');
  };

  // Quick 1-click login for hackathon judges / evaluation
  const quickLoginDemo = async (roleType = 'farmer') => {
    const creds = {
      farmer: { email: 'farmer@krishisarathi.in', password: 'Farmer@123' },
      operator: { email: 'operator@krishisarathi.in', password: 'Operator@123' },
      admin: { email: 'admin@krishisarathi.in', password: 'Admin@123' }
    };
    const target = creds[roleType] || creds.farmer;
    return await login(target.email, target.password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated: !!token,
        role: user?.role || 'guest',
        loading,
        error,
        login,
        register,
        logout,
        quickLoginDemo
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}

export default AuthContext;
