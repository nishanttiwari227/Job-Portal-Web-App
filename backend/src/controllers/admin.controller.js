import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getStats,
  getUsers,
  updateUserStatus,
  getCompanies,
  getJobs,
  getApplications
} from '../services/admin.service.js';

const getDashboardStatsHandler = asyncHandler(async (req, res) => {
  const stats = await getStats();
  sendSuccess(res, HTTP_STATUS.OK, 'Admin stats fetched successfully', stats);
});

const getUsersHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20, search, role, status } = req.query;
  const result = await getUsers({ 
    page: Number(page), 
    limit: Number(limit), 
    search, 
    role, 
    status 
  });
  
  sendSuccess(res, HTTP_STATUS.OK, 'Users fetched successfully', result);
});

const updateUserStatusHandler = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const { status } = req.body;

  const user = await updateUserStatus({ userId: id, status });
  sendSuccess(res, HTTP_STATUS.OK, 'User status updated successfully', { user });
});

const getCompaniesHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await getCompanies({ page: Number(page), limit: Number(limit) });
  
  sendSuccess(res, HTTP_STATUS.OK, 'Companies fetched successfully', result);
});

const getJobsHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await getJobs({ page: Number(page), limit: Number(limit) });
  
  sendSuccess(res, HTTP_STATUS.OK, 'Jobs fetched successfully', result);
});

const getApplicationsHandler = asyncHandler(async (req, res) => {
  const { page = 1, limit = 20 } = req.query;
  const result = await getApplications({ page: Number(page), limit: Number(limit) });
  
  sendSuccess(res, HTTP_STATUS.OK, 'Applications fetched successfully', result);
});

export {
  getDashboardStatsHandler,
  getUsersHandler,
  updateUserStatusHandler,
  getCompaniesHandler,
  getJobsHandler,
  getApplicationsHandler
};