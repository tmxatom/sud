import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { FiMail, FiLock, FiEye, FiEyeOff } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import { BorderBeam } from '@/components/ui/border-beam';
import { loginSchema, formatZodErrors } from '../../lib/validations';
import z from 'zod';

const Login = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

  const { login, user, isAuthenticated, loading: authLoading } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from?.pathname || '/';

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated && user) {
      const redirectPath = user.role === 'customer'
        ? '/customer/dashboard'
        : '/agent/dashboard';
      navigate(redirectPath, { replace: true });
    }
  }, [isAuthenticated, user, authLoading, navigate]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
    setError('');
    // Clear specific field validation error
    if (validationErrors[e.target.name]) {
      setValidationErrors({
        ...validationErrors,
        [e.target.name]: ''
      });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Validate form with Zod
    const validation = loginSchema.safeParse(formData);
    if (!validation.success) {
      setValidationErrors(formatZodErrors(validation.error));

      return;
    }

    setLoading(true);
    setError('');
    setValidationErrors({});

    try {
      await login(formData);
      // Don't navigate here - let useEffect handle it after state updates
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
  };

  // Handle navigation after successful login
  useEffect(() => {
    if (user && !authLoading) {
      const from = location.state?.from?.pathname;

      if (from) {
        navigate(from, { replace: true });
      } else {
        const redirectPath = user.role === 'customer'
          ? '/customer/dashboard'
          : '/agent/dashboard';
        navigate(redirectPath, { replace: true });
      }
    }
  }, [user, authLoading, navigate, location.state]);


  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  // Don't render login form if already authenticated (will redirect)
  if (isAuthenticated) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div>
          <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
            Sign in to your account
          </h2>
          <p className="mt-2 text-center text-sm text-gray-600">
            Access your complaint tracking dashboard
          </p>
        </div>

        <div className="relative">
          <BorderBeam
            size={100}
            duration={12}
            delay={9}
            colorFrom="#3b82f6"
            colorTo="#1d4ed8"
          />
          <form className="mt-8 space-y-6 bg-white p-8 rounded-lg shadow-lg border" onSubmit={handleSubmit}>
            <ErrorMessage message={error} onClose={() => setError('')} />

            <div className="space-y-4">
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                  Email address
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiMail className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="email"
                    name="email"
                    type="email"
                    autoComplete="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${validationErrors.email ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter your email"
                  />
                </div>
                {validationErrors.email && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.email}</p>
                )}
              </div>

              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <FiLock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    name="password"
                    type={showPassword ? 'text' : 'password'}
                    autoComplete="current-password"
                    required
                    value={formData.password}
                    onChange={handleChange}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${validationErrors.password ? 'border-red-300' : 'border-gray-300'
                      } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 focus:z-10 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <FiEyeOff className="h-5 w-5 text-gray-400" />
                    ) : (
                      <FiEye className="h-5 w-5 text-gray-400" />
                    )}
                  </button>
                </div>
                {validationErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.password}</p>
                )}
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={loading}
                className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? <LoadingSpinner size="sm" /> : 'Sign in'}
              </button>
            </div>
          </form>

          <div className="text-center">
            <p className="text-sm text-gray-600">
              Don't have an account?{' '}
              <Link
                to="/register"
                className="font-medium text-blue-600 hover:text-blue-500"
              >
                Register here
              </Link>
            </p>
          </div>

        </div>
      </div>
    </div>
  );
};

export default Login;