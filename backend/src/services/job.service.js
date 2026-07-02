import Job from '../models/Job.model.js';
import Company from '../models/Company.model.js';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../constants/app.js';

const ALLOWED_JOB_UPDATE_FIELDS = [
  'title',
  'description',
  'company',
  'location',
  'jobType',
  'workMode',
  'experienceLevel',
  'salaryRange',
  'skills',
  'responsibilities',
  'benefits',
  'applicationDeadline',
  'status',
];

const createJob = async ({ payload, recruiterId }) => {
  if (payload.company) {
    const companyExists = await Company.exists({ _id: payload.company, isDeleted: false });
    if (!companyExists) {
      throw ApiError.badRequest('Company not found');
    }
  }

  const job = await Job.create({
    ...payload,
    recruiter: recruiterId,
  });

  return job;
};

const updateJob = async ({ jobId, payload, actor }) => {
  const job = await Job.findOne({ _id: jobId, isDeleted: false });

  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  if (actor.role !== USER_ROLES.ADMIN && job.recruiter.toString() !== actor.userId) {
    throw ApiError.forbidden('You do not have permission to update this job');
  }

  if (payload.company) {
    const companyExists = await Company.exists({ _id: payload.company, isDeleted: false });
    if (!companyExists) {
      throw ApiError.badRequest('Company not found');
    }
  }

  const updates = {};
  ALLOWED_JOB_UPDATE_FIELDS.forEach((key) => {
    if (payload[key] !== undefined) {
      updates[key] = payload[key];
    }
  });

  Object.assign(job, updates);
  await job.save();

  return job;
};

const deleteJob = async ({ jobId, actor }) => {
  const job = await Job.findOne({ _id: jobId, isDeleted: false });

  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  if (actor.role !== USER_ROLES.ADMIN && job.recruiter.toString() !== actor.userId) {
    throw ApiError.forbidden('You do not have permission to delete this job');
  }

  job.isDeleted = true;
  job.deletedAt = new Date();
  await job.save();

  return job;
};

const getJobById = async (jobId) => {
  const job = await Job.findOne({ _id: jobId, isDeleted: false })
    .populate('company', 'name slug location industry logo')
    .populate('recruiter', 'name email role profile');

  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  return job;
};

const getJobBySlug = async (slug) => {
  const job = await Job.findOne({ slug, isDeleted: false })
    .populate('company', 'name slug location industry logo')
    .populate('recruiter', 'name email role profile');

  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  return job;
};

const listJobs = async ({ page = 1, limit = 20, search = '', filters = {}, sortBy = 'newest' }) => {
  const query = { isDeleted: false };

  if (search) {
    query.$text = { $search: search };
  }

  if (filters.location) {
    query.location = filters.location;
  }

  if (filters.jobType) {
    query.jobType = filters.jobType;
  }

  if (filters.workMode) {
    query.workMode = filters.workMode;
  }

  if (filters.experienceLevel) {
    query.experienceLevel = filters.experienceLevel;
  }

  if (filters.status) {
    query.status = filters.status;
  }

  if (filters.company) {
    query.company = filters.company;
  }

  const sort = {};
  switch (sortBy) {
    case 'deadline':
      sort.applicationDeadline = 1;
      break;
    case 'salary':
      sort['salaryRange.max'] = -1;
      break;
    default:
      sort.createdAt = -1;
  }

  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort(sort)
      .skip(skip)
      .limit(limit)
      .populate('company', 'name slug location industry logo')
      .populate('recruiter', 'name email role profile'),
    Job.countDocuments(query),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const getRecruiterJobs = async ({ recruiterId, page = 1, limit = 20 }) => {
  const query = { recruiter: recruiterId, isDeleted: false };
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('company', 'name slug location industry logo'),
    Job.countDocuments(query),
  ]);

  return {
    jobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export {
  createJob,
  updateJob,
  deleteJob,
  getJobById,
  getJobBySlug,
  listJobs,
  getRecruiterJobs,
};
