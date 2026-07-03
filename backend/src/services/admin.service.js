import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import Job from '../models/Job.model.js';
import Application from '../models/Application.model.js';
import ApiError from '../utils/apiError.js';
import HTTP_STATUS from '../constants/httpStatus.js';

const getStats = async () => {
  // Use Promise.all for concurrent optimized querying
  const [
    totalUsers,
    totalRecruiters,
    totalCandidates,
    totalCompanies,
    totalJobs,
    totalApplications
  ] = await Promise.all([
    User.countDocuments(),
    User.countDocuments({ role: 'recruiter' }),
    User.countDocuments({ role: 'candidate' }),
    Company.countDocuments(),
    Job.countDocuments(),
    Application.countDocuments()
  ]);

  return {
    users: totalUsers,
    recruiters: totalRecruiters,
    candidates: totalCandidates,
    companies: totalCompanies,
    jobs: totalJobs,
    applications: totalApplications
  };
};

const getUsers = async ({ page, limit, search, role, status }) => {
  const query = {};
  
  if (search) {
    query.$or = [
      { name: { $regex: search, $options: 'i' } },
      { email: { $regex: search, $options: 'i' } }
    ];
  }
  if (role) query.role = role;
  if (status) query.status = status;

  const skip = (page - 1) * limit;

  const [users, total] = await Promise.all([
    User.find(query).select('-password').sort({ createdAt: -1 }).skip(skip).limit(limit),
    User.countDocuments(query)
  ]);

  return {
    users,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

const updateUserStatus = async ({ userId, status }) => {
  const validStatuses = ['active', 'suspended'];
  if (!validStatuses.includes(status)) {
    throw new ApiError(HTTP_STATUS.BAD_REQUEST, 'Invalid status provided');
  }

  const user = await User.findByIdAndUpdate(
    userId,
    { status },
    { new: true, runValidators: true }
  ).select('-password');

  if (!user) {
    throw new ApiError(HTTP_STATUS.NOT_FOUND, 'User not found');
  }

  return user;
};

const getCompanies = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const [companies, total] = await Promise.all([
    Company.find().populate('userId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Company.countDocuments()
  ]);

  return {
    companies,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

const getJobs = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const [jobs, total] = await Promise.all([
    Job.find().populate('company').populate('recruiterId', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Job.countDocuments()
  ]);

  return {
    jobs,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

const getApplications = async ({ page, limit }) => {
  const skip = (page - 1) * limit;
  const [applications, total] = await Promise.all([
    Application.find().populate('job').populate('candidate', 'name email').sort({ createdAt: -1 }).skip(skip).limit(limit),
    Application.countDocuments()
  ]);

  return {
    applications,
    pagination: { total, page, limit, totalPages: Math.ceil(total / limit) }
  };
};

export {
  getStats,
  getUsers,
  updateUserStatus,
  getCompanies,
  getJobs,
  getApplications
};