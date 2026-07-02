import Application from '../models/Application.model.js';
import Job from '../models/Job.model.js';
import User from '../models/User.model.js';
import ApiError from '../utils/apiError.js';
import { APPLICATION_STATUSES } from '../constants/application.js';
import { USER_ROLES } from '../constants/app.js';

const createApplication = async ({ candidateId, jobId }) => {
  const candidate = await User.findById(candidateId).select('role profile');

  if (!candidate || candidate.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate account not found');
  }

  if (!candidate.profile?.resume?.publicId) {
    throw ApiError.badRequest('Resume is required before applying');
  }

  const job = await Job.findOne({ _id: jobId, isDeleted: false }).populate('company recruiter');

  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  const existing = await Application.findOne({ candidate: candidateId, job: jobId });
  if (existing) {
    throw ApiError.conflict('You have already applied to this job');
  }

  const application = await Application.create({
    candidate: candidateId,
    job: jobId,
    company: job.company._id,
    recruiter: job.recruiter._id,
    resumeSnapshot: {
      url: candidate.profile.resume.url,
      publicId: candidate.profile.resume.publicId,
      originalFileName: candidate.profile.resume.originalFileName,
      uploadedAt: candidate.profile.resume.uploadedAt,
    },
    status: APPLICATION_STATUSES.APPLIED,
  });

  return application;
};

const getMyApplications = async ({ candidateId, page = 1, limit = 20 }) => {
  const query = { candidate: candidateId };
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('job', 'title slug location jobType status')
      .populate('company', 'name slug location')
      .populate('recruiter', 'name email profile'),
    Application.countDocuments(query),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const withdrawApplication = async ({ candidateId, applicationId }) => {
  const application = await Application.findOne({ _id: applicationId, candidate: candidateId });

  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  if (application.status === APPLICATION_STATUSES.WITHDRAWN) {
    throw ApiError.badRequest('Application is already withdrawn');
  }

  application.status = APPLICATION_STATUSES.WITHDRAWN;
  application.withdrawnAt = new Date();
  await application.save();

  return application;
};

const getJobApplications = async ({ recruiterId, jobId, page = 1, limit = 20 }) => {
  const job = await Job.findOne({ _id: jobId, recruiter: recruiterId, isDeleted: false });
  if (!job) {
    throw ApiError.forbidden('You do not have access to applications for this job');
  }

  const query = { job: jobId };
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    Application.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('candidate', 'name email profile')
      .populate('company', 'name slug location')
      .populate('job', 'title slug location'),
    Application.countDocuments(query),
  ]);

  return {
    applications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const updateApplicationStatus = async ({ recruiterId, applicationId, status }) => {
  const application = await Application.findById(applicationId).populate('job');

  if (!application) {
    throw ApiError.notFound('Application not found');
  }

  if (application.job.recruiter.toString() !== recruiterId) {
    throw ApiError.forbidden('You do not have permission to update this application');
  }

  application.status = status;
  await application.save();

  return application;
};

export {
  createApplication,
  getMyApplications,
  withdrawApplication,
  getJobApplications,
  updateApplicationStatus,
};
