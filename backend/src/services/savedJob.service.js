import User from '../models/User.model.js';
import Job from '../models/Job.model.js';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../constants/app.js';

const saveJob = async ({ candidateId, jobId }) => {
  const candidate = await User.findById(candidateId).select('role savedJobs');
  if (!candidate || candidate.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate account not found');
  }

  const job = await Job.findOne({ _id: jobId, isDeleted: false });
  if (!job) {
    throw ApiError.notFound('Job not found');
  }

  if (candidate.savedJobs?.some((saved) => saved.toString() === jobId)) {
    throw ApiError.conflict('Job is already saved');
  }

  candidate.savedJobs = [...(candidate.savedJobs || []), jobId];
  await candidate.save();

  return job;
};

const removeSavedJob = async ({ candidateId, jobId }) => {
  const candidate = await User.findById(candidateId).select('role savedJobs');
  if (!candidate || candidate.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate account not found');
  }

  const index = candidate.savedJobs?.findIndex((saved) => saved.toString() === jobId);
  if (index === -1 || candidate.savedJobs?.length === 0) {
    throw ApiError.notFound('Saved job not found');
  }

  candidate.savedJobs.splice(index, 1);
  await candidate.save();
};

const listSavedJobs = async ({ candidateId, page = 1, limit = 20 }) => {
  const candidate = await User.findById(candidateId).select('role savedJobs');
  if (!candidate || candidate.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate account not found');
  }

  const savedJobIds = candidate.savedJobs || [];
  const total = savedJobIds.length;
  const start = (page - 1) * limit;
  const pagedJobIds = savedJobIds.slice(start, start + limit);

  const jobs = await Job.find({ _id: { $in: pagedJobIds }, isDeleted: false })
    .populate('company', 'name slug location')
    .sort({ createdAt: -1 });

  const jobsById = jobs.reduce((acc, job) => {
    acc[job._id.toString()] = job;
    return acc;
  }, {});

  const orderedJobs = pagedJobIds.map((id) => jobsById[id.toString()]).filter(Boolean);

  return {
    savedJobs: orderedJobs,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

export { saveJob, removeSavedJob, listSavedJobs };
