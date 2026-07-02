import apiClient from '../../../services/apiClient.js';

const listJobs = async ({ page = 1, limit = 20, search = '', location = '', sortBy = 'newest' } = {}) => {
  const resp = await apiClient.get('/jobs', { params: { page, limit, search, location, sortBy } });
  return resp.data;
};

const getJobBySlug = async (slug) => {
  const resp = await apiClient.get(`/jobs/slug/${slug}`);
  return resp.data;
};

const applyToJob = async (jobId) => {
  const resp = await apiClient.post('/applications/apply', { job: jobId });
  return resp.data;
};

const withdrawApplication = async (applicationId) => {
  const resp = await apiClient.patch(`/applications/${applicationId}/withdraw`);
  return resp.data;
};

const saveJob = async (jobId) => {
  const resp = await apiClient.post(`/saved-jobs/${jobId}`);
  return resp.data;
};

const unsaveJob = async (jobId) => {
  const resp = await apiClient.delete(`/saved-jobs/${jobId}`);
  return resp.data;
};

export { listJobs, getJobBySlug, applyToJob, withdrawApplication, saveJob, unsaveJob };
