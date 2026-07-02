import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getJobBySlug,
  listJobs,
  getRecruiterJobs,
} from '../services/job.service.js';

const createJobHandler = asyncHandler(async (req, res) => {
  const job = await createJob({ payload: req.body, recruiterId: req.user.userId });

  sendSuccess(res, HTTP_STATUS.CREATED, 'Job created successfully', {
    job: job.toPublicJSON(),
  });
});

const updateJobHandler = asyncHandler(async (req, res) => {
  const job = await updateJob({ jobId: req.params.id, payload: req.body, actor: req.user });

  sendSuccess(res, HTTP_STATUS.OK, 'Job updated successfully', {
    job: job.toPublicJSON(),
  });
});

const deleteJobHandler = asyncHandler(async (req, res) => {
  await deleteJob({ jobId: req.params.id, actor: req.user });

  sendSuccess(res, HTTP_STATUS.OK, 'Job deleted successfully');
});

const getJobByIdHandler = asyncHandler(async (req, res) => {
  const job = await getJobById(req.params.id);

  sendSuccess(res, HTTP_STATUS.OK, 'Job fetched successfully', {
    job: job.toPublicJSON(),
  });
});

const getJobBySlugHandler = asyncHandler(async (req, res) => {
  const job = await getJobBySlug(req.params.slug);

  sendSuccess(res, HTTP_STATUS.OK, 'Job fetched successfully', {
    job: job.toPublicJSON(),
  });
});

const listJobsHandler = asyncHandler(async (req, res) => {
  const { page, limit, search, location, jobType, workMode, experienceLevel, status, company, sortBy } = req.query;
  const result = await listJobs({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    search: search || '',
    filters: { location, jobType, workMode, experienceLevel, status, company },
    sortBy: sortBy || 'newest',
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Jobs listed successfully', result);
});

const getRecruiterJobsHandler = asyncHandler(async (req, res) => {
  const { page, limit } = req.query;
  const result = await getRecruiterJobs({
    recruiterId: req.user.userId,
    page: Number(page) || 1,
    limit: Number(limit) || 20,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Recruiter jobs retrieved successfully', result);
});

export {
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
  getJobByIdHandler,
  getJobBySlugHandler,
  listJobsHandler,
  getRecruiterJobsHandler,
};