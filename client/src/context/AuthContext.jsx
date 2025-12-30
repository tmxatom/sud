import React, { createContext, useState, useEffect, useContext } from 'react';
import { authService } from '../services/authService';
import { generateToken } from '../notifications/firebase';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Check session on mount
  useEffect(() => {
    checkSession();
  }, []);

  const checkSession = async () => {
    try {
      setLoading(true);
      const response = await authService.checkSession();
      if (response.authenticated) {
        setUser(response.user);
      } else {
        setUser(null);
      }
    } catch (error) {
      console.error('Session check error:', error);
      setUser(null);
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      setError(null);
      const response = await authService.login(credentials);
      setUser(response.user);
      
      // Generate and save FCM token after successful login
      try {
        const fcmToken = await generateToken();
        if (fcmToken) {
          console.log('FCM token generated and saved after login');
        }
      } catch (fcmError) {
        console.error('Error generating FCM token after login:', fcmError);
        // Don't throw error for FCM token failure, login was successful
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Login failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await authService.register(userData);
      setUser(response.user);
      
      // Generate and save FCM token after successful registration
      try {
        const fcmToken = await generateToken();
        if (fcmToken) {
          console.log('FCM token generated and saved after registration');
        }
      } catch (fcmError) {
        console.error('Error generating FCM token after registration:', fcmError);
        // Don't throw error for FCM token failure, registration was successful
      }
      
      return response;
    } catch (error) {
      const errorMessage = error.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      throw new Error(errorMessage);
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
      setUser(null);
      setError(null);
    } catch (error) {
      console.error('Logout error:', error);
      // Force logout on client side even if server request fails
      setUser(null);
    }
  };

  const clearError = () => {
    setError(null);
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    checkSession,
    clearError,
    isAuthenticated: !!user,
    isCustomer: user?.role === 'customer',
    isAgent: user?.role === 'agent'
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};