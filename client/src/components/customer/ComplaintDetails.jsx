import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiArrowLeft, FiMessageCircle, FiClock, FiUser } from 'react-icons/fi';
import { complaintService } from '../../services/complaintService';
import { useAuth } from '../../context/AuthContext';
import LoadingSpinner from '../shared/LoadingSpinner';
import ErrorMessage from '../shared/ErrorMessage';
import StatusBadge from '../shared/StatusBadge';
import PriorityIndicator from '../shared/PriorityIndicator';
import { formatDate } from '../../utils/helpers';
import { commentSchema, formatZodErrors } from '../../lib/validations';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);
  const [commentErrors, setCommentErrors] = useState({});

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      setError('');
      const response = await complaintService.getComplaintById(id);
      const complaintData = response.complaint || response;

    
      if (complaintData.customerId !== user.id && complaintData.customerId?._id !== user.id) {
        setError('You do not have permission to view this complaint.');
        return;
      }

      setComplaint(complaintData);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      if (error.response?.status === 403) {
        setError('You do not have permission to view this complaint.');
      } else if (error.response?.status === 404) {
        setError('Complaint not found.');
      } else {
        setError('Failed to load complaint details. Please try again.');
      }
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
  
    const validation = commentSchema.safeParse({ text: newComment });
    if (!validation.success) {
      setCommentErrors(formatZodErrors(validation.error));
      return;
    }

    try {
      setSubmittingComment(true);
      setCommentErrors({});
      await complaintService.addComment(id, { text: newComment });
      setNewComment('');
      fetchComplaint(); 
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again.');
    } finally {
      setSubmittingComment(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-500 mb-6"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <ErrorMessage message={error} />
        </div>
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-500 mb-6"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900">Complaint not found</h2>
            <p className="text-gray-600 mt-2">The complaint you're looking for doesn't exist or has been removed.</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => navigate('/customer/dashboard')}
            className="flex items-center text-blue-600 hover:text-blue-500 mb-4"
          >
            <FiArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </button>
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Complaint Details</h1>
              <p className="mt-1 text-sm text-gray-600">
                Complaint ID: {complaint.complaintId}
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <StatusBadge status={complaint.status} />
              <PriorityIndicator priority={complaint.priority} />
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-6 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Complaint Information */}
            <div className="bg-white shadow rounded-lg p-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">
                {complaint.subject}
              </h2>

              <div className="prose max-w-none mb-6">
                <p className="text-gray-700 whitespace-pre-wrap">
                  {complaint.description}
                </p>
              </div>

              <div className="border-t border-gray-200 pt-6">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-500">Category:</span>
                    <p className="text-gray-900">{complaint.category}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Policy Number:</span>
                    <p className="text-gray-900">{complaint.policyNumber}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-500">Created:</span>
                    <p className="text-gray-900">{formatDate(complaint.createdAt)}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-white shadow rounded-lg p-6">
              <div className="flex items-center mb-6">
                <FiMessageCircle className="mr-2 h-5 w-5 text-gray-400" />
                <h3 className="text-lg font-medium text-gray-900">
                  Comments ({complaint.comments?.length || 0})
                </h3>
              </div>

              {/* Add Comment Form */}
              <form onSubmit={handleAddComment} className="mb-6">
                <div className="mb-4">
                  <label htmlFor="comment" className="block text-sm font-medium text-gray-700 mb-2">
                    Add a comment
                  </label>
                  <textarea
                    id="comment"
                    value={newComment}
                    onChange={(e) => {
                      setNewComment(e.target.value);
                      // Clear validation errors when user types
                      if (commentErrors.text) {
                        setCommentErrors({});
                      }
                    }}
                    placeholder="Share additional information or ask a question..."
                    className={`w-full p-3 border ${
                      commentErrors.text ? 'border-red-300' : 'border-gray-300'
                    } rounded-md shadow-sm focus:ring-blue-500 focus:border-blue-500`}
                    rows="4"
                  />
                  {commentErrors.text && (
                    <p className="mt-1 text-sm text-red-600">{commentErrors.text}</p>
                  )}
                </div>
                <button
                  type="submit"
                  disabled={submittingComment}
                  className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submittingComment ? 'Adding...' : 'Add Comment'}
                </button>
              </form>

              {/* Comments List */}
              <div className="space-y-4">
                {complaint.comments?.map((comment) => (
                  <div key={comment._id} className="border-l-4 border-blue-200 pl-4 py-3">
                    <div className="flex items-center justify-between mb-2">
                      <div className="flex items-center">
                        <FiUser className="mr-2 h-4 w-4 text-gray-400" />
                        <span className="font-medium text-gray-900">
                          {comment.userId?.name || comment.userName || 'Unknown User'}
                        </span>
                        {comment.userRole && (
                          <span className="ml-2 inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                            {comment.userRole}
                          </span>
                        )}
                      </div>
                      <span className="text-sm text-gray-500">
                        {formatDate(comment.createdAt)}
                      </span>
                    </div>
                    <p className="text-gray-700 whitespace-pre-wrap">
                      {comment.text}
                    </p>
                  </div>
                ))}
                {(!complaint.comments || complaint.comments.length === 0) && (
                  <div className="text-center py-8">
                    <FiMessageCircle className="mx-auto h-12 w-12 text-gray-400" />
                    <p className="mt-2 text-gray-500">No comments yet</p>
                    <p className="text-sm text-gray-400">Be the first to add a comment</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-3 space-y-6">
            {/* Status History */}
            {complaint.statusHistory && complaint.statusHistory.length > 0 && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex items-center mb-6">
                  <FiClock className="mr-2 h-5 w-5 text-gray-400" />
                  <h3 className="text-lg font-medium text-gray-900">
                    Status History
                  </h3>
                </div>
                <div className="space-y-6">
                  {complaint.statusHistory.map((history, index) => (
                    <div key={index} className="relative">
                      {index !== complaint.statusHistory.length - 1 && (
                        <div className="absolute left-4 top-10 w-0.5 h-12 bg-gray-200"></div>
                      )}
                      <div className="flex items-start space-x-4">
                        <div className="flex-shrink-0 w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                          <div className="w-3 h-3 bg-blue-600 rounded-full"></div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between mb-2">
                            <StatusBadge status={history.status} />
                            <span className="text-sm text-gray-500">
                              {formatDate(history.changedAt)}
                            </span>
                          </div>
                          {history.notes && (
                            <p className="text-sm text-gray-600 mb-2 leading-relaxed">{history.notes}</p>
                          )}
                          {history.changedByName && (
                            <p className="text-xs text-gray-500">
                              Updated by {history.changedByName}
                              {history.changedByRole && ` (${history.changedByRole})`}
                            </p>
                          )}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Quick Info */}
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-6">
                Quick Information
              </h3>
              <div className="space-y-4">
                <div className="border-b border-gray-100 pb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-1">Last Updated:</span>
                  <p className="text-gray-900">{formatDate(complaint.updatedAt)}</p>
                </div>
                <div className="border-b border-gray-100 pb-4">
                  <span className="block text-sm font-medium text-gray-500 mb-2">Current Status:</span>
                  <StatusBadge status={complaint.status} />
                </div>
                <div>
                  <span className="block text-sm font-medium text-gray-500 mb-2">Priority Level:</span>
                  <PriorityIndicator priority={complaint.priority} />
                </div>
              </div>
            </div>

            {/* Help Section */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
              <h3 className="text-lg font-medium text-blue-900 mb-2">
                Need Help?
              </h3>
              <p className="text-sm text-blue-700 mb-4">
                If you have questions about your complaint or need to provide additional information,
                feel free to add a comment above. Our support team will respond as soon as possible.
              </p>
              <div className="text-xs text-blue-600">
                <p>• Response time: 24-48 hours</p>
                <p>• Critical issues: 2-4 hours</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;