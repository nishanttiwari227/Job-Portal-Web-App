import apiClient from '../../../services/apiClient.js';

// FIX: Accept a generic params object to support all backend filters 
// (jobType, workMode, experienceLevel, etc.) instead of hardcoding a few.
const listJobs = async (params = {}) => {
  // Clean undefined/null values so they aren't sent to the backend
  const cleanParams = Object.fromEntries(
    Object.entries(params).filter(([_, v]) => v != null && v !== '')
  );
  
  // Set default pagination
  if (!cleanParams.page) cleanParams.page = 1;
  if (!cleanParams.limit) cleanParams.limit = 20;
  if (!cleanParams.sortBy) cleanParams.sortBy = 'newest';

  const resp = await apiClient.get('/jobs', { params: cleanParams });
  
  // FIX: Safely unwrap the nested API response wrapper
  return resp.data?.data || resp.data;
};

const getJobBySlug = async (slug) => {
  const resp = await apiClient.get(`/jobs/slug/${slug}`);
  return resp.data?.data || resp.data;
};

const applyToJob = async (jobId) => {
  const resp = await apiClient.post('/applications/apply', { job: jobId });
  return resp.data?.data || resp.data;
};

const withdrawApplication = async (applicationId) => {
  const resp = await apiClient.patch(`/applications/${applicationId}/withdraw`);
  return resp.data?.data || resp.data;
};

const saveJob = async (jobId) => {
  const resp = await apiClient.post(`/saved-jobs/${jobId}`);
  return resp.data?.data || resp.data;
};

const unsaveJob = async (jobId) => {
  const resp = await apiClient.delete(`/saved-jobs/${jobId}`);
  return resp.data?.data || resp.data;
};

export { listJobs, getJobBySlug, applyToJob, withdrawApplication, saveJob, unsaveJob };