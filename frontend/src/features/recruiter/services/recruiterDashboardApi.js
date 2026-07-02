import apiClient from '../../../services/apiClient.js';

const getRecruiterProfile = async () => {
  const response = await apiClient.get('/recruiter/profile');
  return response.data;
};

const getRecruiterJobs = async () => {
  const response = await apiClient.get('/jobs/recruiter/me', { params: { page: 1, limit: 20 } });
  return response.data;
};

export { getRecruiterProfile, getRecruiterJobs };