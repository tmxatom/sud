import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { complaintService } from '../../services/complaintService';
import LoadingSpinner from '../shared/LoadingSpinner';

const ComplaintDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState(null);
  const [loading, setLoading] = useState(true);
  const [newComment, setNewComment] = useState('');
  const [submittingComment, setSubmittingComment] = useState(false);

  // Helper function to format dates safely
  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      const date = new Date(dateString);
      if (isNaN(date.getTime())) return 'Invalid Date';
      return date.toLocaleString();
    } catch (error) {
      return 'Invalid Date';
    }
  };

  useEffect(() => {
    fetchComplaint();
  }, [id]);

  const fetchComplaint = async () => {
    try {
      setLoading(true);
      console.log('Fetching complaint with ID:', id);
      const response = await complaintService.getComplaintById(id);
      console.log('Full API response:', response);
      console.log('Response data type:', typeof response);
      console.log('Response keys:', Object.keys(response || {}));
      
      // Backend returns { complaint: {...} }, so we need to extract the complaint
      const complaintData = response.complaint || response;
      console.log('Extracted complaint data:', complaintData);
      console.log('Complaint data type:', typeof complaintData);
      console.log('Complaint keys:', Object.keys(complaintData || {}));
      
      setComplaint(complaintData);
    } catch (error) {
      console.error('Error fetching complaint:', error);
      console.error('Error response:', error.response?.data);
      console.error('Error status:', error.response?.status);
      setComplaint(null);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusUpdate = async (newStatus) => {
    try {
      await complaintService.updateStatus(id, { status: newStatus });
      fetchComplaint();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const handlePriorityUpdate = async (newPriority) => {
    try {
      await complaintService.updatePriority(id, { priority: newPriority });
      fetchComplaint();
    } catch (error) {
      console.error('Error updating priority:', error);
    }
  };

  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;

    try {
      setSubmittingComment(true);
      await complaintService.addComment(id, { text: newComment });
      setNewComment('');
      fetchComplaint();
    } catch (error) {
      console.error('Error adding comment:', error);
    } finally {
      setSubmittingComment(false);
    }
  };

  const getStatusColor = (status) => {
    const colors = {
      'Submitted': 'bg-blue-100 text-blue-800',
      'submitted': 'bg-blue-100 text-blue-800',
      'In Progress': 'bg-yellow-100 text-yellow-800',
      'in-progress': 'bg-yellow-100 text-yellow-800',
      'Resolved': 'bg-green-100 text-green-800',
      'resolved': 'bg-green-100 text-green-800',
      'Closed': 'bg-gray-100 text-gray-800',
      'closed': 'bg-gray-100 text-gray-800'
    };
    return colors[status] || 'bg-gray-100 text-gray-800';
  };

  const getPriorityColor = (priority) => {
    const colors = {
      'Low': 'bg-green-100 text-green-800',
      'low': 'bg-green-100 text-green-800',
      'Medium': 'bg-yellow-100 text-yellow-800',
      'medium': 'bg-yellow-100 text-yellow-800',
      'High': 'bg-red-100 text-red-800',
      'high': 'bg-red-100 text-red-800',
      'Critical': 'bg-red-100 text-red-800',
      'critical': 'bg-red-100 text-red-800'
    };
    return colors[priority] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <LoadingSpinner size="lg" />
      </div>
    );
  }

  if (!complaint) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900">Complaint not found</h2>
          <p className="text-gray-600 mt-2">ID: {id}</p>
          <button
            onClick={() => navigate('/agent/dashboard')}
            className="mt-4 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  // Debug logging
  console.log('Rendering complaint:', complaint);
  console.log('Complaint ID:', complaint?.complaintId);
  console.log('Customer ID:', complaint?.customerId);
  console.log('Created At:', complaint?.createdAt);

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <button
          onClick={() => navigate('/agent/dashboard')}
          className="text-blue-600 hover:text-blue-800 mb-4"
        >
          ← Back to Dashboard
        </button>
        <h1 className="text-3xl font-bold text-gray-900">
          Complaint Details
        </h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main Content */}
        <div className="lg:col-span-2">
          <div className="bg-white shadow rounded-lg p-6 mb-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-xl font-semibold text-gray-900">
                {complaint.complaintId}
              </h2>
              <div className="flex space-x-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(complaint.status)}`}>
                  {complaint.status}
                </span>
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getPriorityColor(complaint.priority)}`}>
                  {complaint.priority}
                </span>
              </div>
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {complaint.subject}
            </h3>
            
            <div className="prose max-w-none">
              <p className="text-gray-700 whitespace-pre-wrap">
                {complaint.description}
              </p>
            </div>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="font-medium text-gray-500">Customer:</span>
                  <p className="text-gray-900">{complaint.customerId?.name || complaint.customerName || 'N/A'}</p>
                  <p className="text-gray-600">{complaint.customerId?.email || 'N/A'}</p>
                </div>
                <div>
                  <span className="font-medium text-gray-500">Created:</span>
                  <p className="text-gray-900">
                    {formatDate(complaint.createdAt)}
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Comments Section */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Comments ({complaint.comments?.length || 0})
            </h3>
            
            {/* Add Comment Form */}
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full p-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows="3"
              />
              <button
                type="submit"
                disabled={submittingComment || !newComment.trim()}
                className="mt-2 bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600 disabled:opacity-50"
              >
                {submittingComment ? 'Adding...' : 'Add Comment'}
              </button>
            </form>

            {/* Comments List */}
            <div className="space-y-4">
              {complaint.comments?.map((comment) => (
                <div key={comment._id} className="border-l-4 border-blue-200 pl-4">
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">
                      {comment.userId?.name || comment.userName || 'Unknown User'}
                    </span>
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
                <p className="text-gray-500 text-center py-4">No comments yet</p>
              )}
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Status Update */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Status
            </h3>
            <select
              value={complaint.status}
              onChange={(e) => handleStatusUpdate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Submitted">Submitted</option>
              <option value="In Progress">In Progress</option>
              <option value="Resolved">Resolved</option>
              <option value="Closed">Closed</option>
            </select>
          </div>

          {/* Priority Update */}
          <div className="bg-white shadow rounded-lg p-6">
            <h3 className="text-lg font-medium text-gray-900 mb-4">
              Update Priority
            </h3>
            <select
              value={complaint.priority}
              onChange={(e) => handlePriorityUpdate(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="Low">Low</option>
              <option value="Medium">Medium</option>
              <option value="High">High</option>
              <option value="Critical">Critical</option>
            </select>
          </div>

          {/* Status History */}
          {complaint.statusHistory && complaint.statusHistory.length > 0 && (
            <div className="bg-white shadow rounded-lg p-6">
              <h3 className="text-lg font-medium text-gray-900 mb-4">
                Status History
              </h3>
              <div className="space-y-3">
                {complaint.statusHistory.map((history, index) => (
                  <div key={index} className="text-sm">
                    <div className="flex items-center justify-between">
                      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(history.status)}`}>
                        {history.status}
                      </span>
                      <span className="text-gray-500">
                        {formatDate(history.changedAt)}
                      </span>
                    </div>
                    {history.notes && (
                      <p className="mt-1 text-gray-600">{history.notes}</p>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ComplaintDetails;