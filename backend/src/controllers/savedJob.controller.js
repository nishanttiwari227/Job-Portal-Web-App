import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import { saveJob, removeSavedJob, listSavedJobs } from '../services/savedJob.service.js';

const saveJobHandler = asyncHandler(async (req, res) => {
  const job = await saveJob({ candidateId: req.user.userId, jobId: req.params.jobId });

  sendSuccess(res, HTTP_STATUS.CREATED, 'Job saved successfully', { job: job.toPublicJSON() });
});

const removeSavedJobHandler = asyncHandler(async (req, res) => {
  await removeSavedJob({ candidateId: req.user.userId, jobId: req.params.jobId });

  sendSuccess(res, HTTP_STATUS.OK, 'Saved job removed successfully');
});

const listSavedJobsHandler = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await listSavedJobs({ candidateId: req.user.userId, page, limit });

  sendSuccess(res, HTTP_STATUS.OK, 'Saved jobs retrieved successfully', result);
});

export { saveJobHandler, removeSavedJobHandler, listSavedJobsHandler };
