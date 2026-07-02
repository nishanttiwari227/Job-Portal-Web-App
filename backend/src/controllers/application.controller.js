import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import * as applicationService from '../services/application.service.js';

const applyToJob = asyncHandler(async (req, res) => {
  const application = await applicationService.createApplication({
    candidateId: req.user.userId,
    jobId: req.body.job,
  });

  sendSuccess(res, HTTP_STATUS.CREATED, 'Application submitted successfully', {
    application,
  });
});

const listMyApplications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await applicationService.getMyApplications({
    candidateId: req.user.userId,
    page,
    limit,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Applications listed successfully', result);
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const application = await applicationService.withdrawApplication({
    candidateId: req.user.userId,
    applicationId: req.params.id,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Application withdrawn successfully', {
    application,
  });
});

const listJobApplications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await applicationService.getJobApplications({
    recruiterId: req.user.userId,
    jobId: req.params.jobId,
    page,
    limit,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Job applications listed successfully', result);
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const application = await applicationService.updateApplicationStatus({
    recruiterId: req.user.userId,
    applicationId: req.params.id,
    status: req.body.status,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Application status updated successfully', {
    application,
  });
});

export {
  applyToJob,
  listMyApplications,
  withdrawApplication,
  listJobApplications,
  updateApplicationStatus,
};
