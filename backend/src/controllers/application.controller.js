import asyncHandler from '../utils/asyncHandler.js';
import { validationResult } from 'express-validator';
import * as applicationService from '../services/application.service.js';
import ApiError from '../utils/apiError.js';

const applyToJob = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', { errors: errors.array() });
  }

  const application = await applicationService.createApplication({
    candidateId: req.user.id,
    jobId: req.body.job,
  });

  res.status(201).json({ success: true, data: application });
});

const listMyApplications = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await applicationService.getMyApplications({
    candidateId: req.user.id,
    page,
    limit,
  });

  res.json({ success: true, data: result });
});

const withdrawApplication = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', { errors: errors.array() });
  }

  const application = await applicationService.withdrawApplication({
    candidateId: req.user.id,
    applicationId: req.params.id,
  });

  res.json({ success: true, data: application });
});

const listJobApplications = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', { errors: errors.array() });
  }

  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await applicationService.getJobApplications({
    recruiterId: req.user.id,
    jobId: req.params.jobId,
    page,
    limit,
  });

  res.json({ success: true, data: result });
});

const updateApplicationStatus = asyncHandler(async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    throw ApiError.badRequest('Validation failed', { errors: errors.array() });
  }

  const application = await applicationService.updateApplicationStatus({
    recruiterId: req.user.id,
    applicationId: req.params.id,
    status: req.body.status,
  });

  res.json({ success: true, data: application });
});

export {
  applyToJob,
  listMyApplications,
  withdrawApplication,
  listJobApplications,
  updateApplicationStatus,
};
