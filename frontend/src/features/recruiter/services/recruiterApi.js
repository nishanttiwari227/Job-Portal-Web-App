import apiClient from '../../../services/apiClient.js';

// recruiter profile
const getRecruiterProfile = async () => {
  const resp = await apiClient.get('/recruiter/profile');
  return resp.data;
};

const updateRecruiterProfile = async (payload) => {
  const resp = await apiClient.put('/recruiter/profile', payload);
  return resp.data;
};

// company
const createCompany = async (payload) => {
  const resp = await apiClient.post('/companies', payload);
  return resp.data;
};

const updateCompany = async (companyId, payload) => {
  const resp = await apiClient.put(`/companies/${companyId}`, payload);
  return resp.data;
};

const getCompanyById = async (id) => {
  const resp = await apiClient.get(`/companies/${id}`);
  return resp.data;
};

// jobs
const getRecruiterJobs = async ({ page = 1, limit = 20 } = {}) => {
  const resp = await apiClient.get('/jobs/recruiter/me', { params: { page, limit } });
  return resp.data;
};

const createJob = async (payload) => {
  const resp = await apiClient.post('/jobs', payload);
  return resp.data;
};

const updateJob = async (id, payload) => {
  const resp = await apiClient.put(`/jobs/${id}`, payload);
  return resp.data;
};

const deleteJob = async (id) => {
  const resp = await apiClient.delete(`/jobs/${id}`);
  return resp.data;
};

// applicants
const getJobApplicants = async ({ jobId, page = 1, limit = 20 }) => {
  const resp = await apiClient.get(`/applications/job/${jobId}`, { params: { page, limit } });
  return resp.data;
};

const updateApplicationStatus = async ({ applicationId, status }) => {
  const resp = await apiClient.patch(`/applications/${applicationId}/status`, { status });
  return resp.data;
};

export {
  getRecruiterProfile,
  updateRecruiterProfile,
  createCompany,
  updateCompany,
  getCompanyById,
  getRecruiterJobs,
  createJob,
  updateJob,
  deleteJob,
  getJobApplicants,
  updateApplicationStatus,
};
