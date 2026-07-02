import apiClient from '../../../services/apiClient.js';

const getCandidateProfile = async () => {
  const response = await apiClient.get('/candidate/profile');
  return response.data;
};

const updateCandidateProfile = async (payload) => {
  const response = await apiClient.put('/candidate/profile', payload);
  return response.data;
};

const uploadResume = async (file) => {
  const fd = new FormData();
  fd.append('resume', file);
  const response = await apiClient.post('/candidate/resume', fd);
  return response.data;
};

const deleteResume = async () => {
  const response = await apiClient.delete('/candidate/resume');
  return response.data;
};

const listSavedJobs = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get('/saved-jobs', { params: { page, limit } });
  return response.data;
};

const removeSavedJob = async (jobId) => {
  const response = await apiClient.delete(`/saved-jobs/${jobId}`);
  return response.data;
};

const saveJob = async (jobId) => {
  const response = await apiClient.post(`/saved-jobs/${jobId}`);
  return response.data;
};

const listNotifications = async ({ page = 1, limit = 20 } = {}) => {
  const response = await apiClient.get('/notifications', { params: { page, limit } });
  return response.data;
};

const markNotificationRead = async (id) => {
  const response = await apiClient.patch(`/notifications/${id}/read`);
  return response.data;
};

const markAllNotificationsRead = async () => {
  const response = await apiClient.patch('/notifications/read-all');
  return response.data;
};

export {
  getCandidateProfile,
  updateCandidateProfile,
  uploadResume,
  deleteResume,
  listSavedJobs,
  removeSavedJob,
  listNotifications,
  markNotificationRead,
  markAllNotificationsRead,
  saveJob,
};
