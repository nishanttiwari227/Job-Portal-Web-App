import apiClient from '../../../services/apiClient.js';

const getCandidateProfile = async () => {
  const response = await apiClient.get('/candidate/profile');
  return response.data;
};

const getApplicationsSummary = async () => {
  const response = await apiClient.get('/applications/me');
  return response.data;
};

const getSavedJobsCount = async () => {
  const response = await apiClient.get('/saved-jobs');
  return response.data;
};

const getNotifications = async () => {
  const response = await apiClient.get('/notifications', { params: { page: 1, limit: 5 } });
  return response.data;
};

export { getCandidateProfile, getApplicationsSummary, getSavedJobsCount, getNotifications };
