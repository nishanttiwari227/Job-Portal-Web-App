import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getRecruiterProfile,
  updateRecruiterProfile,
} from '../services/recruiterProfile.service.js';

const getRecruiterProfileHandler = asyncHandler(async (req, res) => {
  const user = await getRecruiterProfile(req.user.userId);

  sendSuccess(res, HTTP_STATUS.OK, 'Recruiter profile retrieved successfully', {
    profile: user.profile,
  });
});

const updateRecruiterProfileHandler = asyncHandler(async (req, res) => {
  const user = await updateRecruiterProfile({ recruiterId: req.user.userId, payload: req.body });

  sendSuccess(res, HTTP_STATUS.OK, 'Recruiter profile updated successfully', {
    profile: user.profile,
  });
});

export { getRecruiterProfileHandler, updateRecruiterProfileHandler };
