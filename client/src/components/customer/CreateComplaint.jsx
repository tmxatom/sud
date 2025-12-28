import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiSend } from 'react-icons/fi';
import { useAuth } from '../../context/AuthContext';
import { complaintService } from '../../services/complaintService';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import SuccessNotification from '../shared/SuccessNotification';
import { COMPLAINT_CATEGORIES, COMPLAINT_PRIORITIES } from '../../utils/constants';
import { complaintSchema, formatZodErrors } from '../../lib/validations';

const CreateComplaint = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    policyNumber: user?.policyNumber || '',
    category: '',
    priority: 'Medium',
    subject: '',
    description: ''
  });
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [validationErrors, setValidationErrors] = useState({});

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

  const validateForm = () => {
    const validation = complaintSchema.safeParse(formData);
    if (!validation.success) {
      setValidationErrors(formatZodErrors(validation.error));
      return false;
    }
    setValidationErrors({});
    return true;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setLoading(true);
    setError('');

    try {
      console.log('Submitting complaint with data:', formData);
      const response = await complaintService.createComplaint(formData);
      console.log('Complaint created successfully:', response);
      setSuccess('Complaint submitted successfully!');
      
      // Redirect to customer dashboard after a short delay
      setTimeout(() => {
        console.log('Redirecting to customer dashboard');
        navigate('/customer/dashboard');
      }, 1500);
    } catch (error) {
      console.error('Create complaint error:', error);
      if (error.response?.status === 401) {
        console.log('Authentication error, redirecting to login');
        // Session expired, redirect to login
        navigate('/login');
      } else {
        const errorMessage = error.response?.data?.message || 'Failed to create complaint';
        console.error('Setting error message:', errorMessage);
        setError(errorMessage);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/customer/dashboard');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-3xl mx-auto py-6 sm:px-6 lg:px-8">
        <div className="px-4 py-6 sm:px-0">
          {/* Header */}
          <div className="flex items-center mb-6">
            <button
              onClick={handleBack}
              className="mr-4 inline-flex items-center text-gray-600 hover:text-gray-900"
            >
              <FiArrowLeft className="h-5 w-5" />
            </button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Create New Complaint</h1>
              <p className="mt-1 text-sm text-gray-600">
                Submit your complaint and we'll help resolve it quickly
              </p>
            </div>
          </div>

          <ErrorMessage message={error} onClose={() => setError('')} className="mb-6" />
          <SuccessNotification message={success} onClose={() => setSuccess('')} className="mb-6" />

          {/* Form */}
          <div className="bg-white shadow rounded-lg">
            <form onSubmit={handleSubmit} className="space-y-6 p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="policyNumber" className="block text-sm font-medium text-gray-700">
                    Policy Number *
                  </label>
                  <input
                    type="text"
                    id="policyNumber"
                    name="policyNumber"
                    required
                    value={formData.policyNumber}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors.policyNumber ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Enter your policy number"
                  />
                  {validationErrors.policyNumber && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.policyNumber}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="category" className="block text-sm font-medium text-gray-700">
                    Category *
                  </label>
                  <select
                    id="category"
                    name="category"
                    required
                    value={formData.category}
                    onChange={handleChange}
                    className={`mt-1 block w-full border ${
                      validationErrors.category ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  >
                    <option value="">Select a category</option>
                    {COMPLAINT_CATEGORIES.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                  {validationErrors.category && (
                    <p className="mt-1 text-sm text-red-600">{validationErrors.category}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="priority" className="block text-sm font-medium text-gray-700">
                  Priority
                </label>
                <select
                  id="priority"
                  name="priority"
                  value={formData.priority}
                  onChange={handleChange}
                  className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                >
                  {COMPLAINT_PRIORITIES.map(priority => (
                    <option key={priority} value={priority}>{priority}</option>
                  ))}
                </select>
                <p className="mt-1 text-sm text-gray-500">
                  Select the urgency level of your complaint
                </p>
              </div>

              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-700">
                  Subject *
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    validationErrors.subject ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Brief summary of your complaint"
                />
                {validationErrors.subject && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.subject}</p>
                )}
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                  Description *
                </label>
                <textarea
                  id="description"
                  name="description"
                  rows={6}
                  required
                  value={formData.description}
                  onChange={handleChange}
                  className={`mt-1 block w-full border ${
                    validationErrors.description ? 'border-red-300' : 'border-gray-300'
                  } rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Provide detailed information about your complaint..."
                />
                {validationErrors.description && (
                  <p className="mt-1 text-sm text-red-600">{validationErrors.description}</p>
                )}
                <p className="mt-1 text-sm text-gray-500">
                  Please provide as much detail as possible to help us resolve your complaint quickly
                </p>
              </div>

              <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
                <button
                  type="button"
                  onClick={handleBack}
                  className="inline-flex items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {loading ? (
                    <LoadingSpinner size="sm" />
                  ) : (
                    <>
                      <FiSend className="mr-2 h-4 w-4" />
                      Submit Complaint
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CreateComplaint;