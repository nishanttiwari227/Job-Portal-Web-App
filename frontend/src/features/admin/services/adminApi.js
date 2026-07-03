import apiClient from '../../../services/apiClient.js';

export const adminApi = {
  getStats: async () => {
    const response = await apiClient.get('/admin/stats');
    return response.data?.data || response.data;
  },
  getUsers: async (params) => {
    const response = await apiClient.get('/admin/users', { params });
    return response.data?.data || response.data;
  },
  updateUserStatus: async ({ id, status }) => {
    const response = await apiClient.patch(`/admin/users/${id}/status`, { status });
    return response.data?.data || response.data;
  },
  getCompanies: async (params) => {
    const response = await apiClient.get('/admin/companies', { params });
    return response.data?.data || response.data;
  },
  getJobs: async (params) => {
    const response = await apiClient.get('/admin/jobs', { params });
    return response.data?.data || response.data;
  },
  getApplications: async (params) => {
    const response = await apiClient.get('/admin/applications', { params });
    return response.data?.data || response.data;
  }
};