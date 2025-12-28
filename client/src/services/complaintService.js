import api from './api';

export const complaintService = {
  // Create new complaint
  createComplaint: async (complaintData) => {
    const response = await api.post('/complaints', complaintData);
    return response.data;
  },

  // Get complaints
  getComplaints: async (params = {}) => {
    const response = await api.get('/complaints', { params });
    return response.data;
  },

  // Get single complaint
  getComplaintById: async (id) => {
    const response = await api.get(`/complaints/${id}`);
    return response.data;
  },

  // Update complaint status
  updateStatus: async (id, statusData) => {
    const response = await api.put(`/complaints/${id}/status`, statusData);
    return response.data;
  },

  // Update complaint priority
  updatePriority: async (id, priorityData) => {
    const response = await api.put(`/complaints/${id}/priority`, priorityData);
    return response.data;
  },

  // Add comment
  addComment: async (id, commentData) => {
    const response = await api.post(`/complaints/${id}/comments`, commentData);
    return response.data;
  },

  // Archive complaint
  archiveComplaint: async (id) => {
    const response = await api.put(`/complaints/${id}/archive`);
    return response.data;
  },

  // Get complaint statistics
  getStats: async () => {
    const response = await api.get('/complaints/stats');
    return response.data;
  }
};