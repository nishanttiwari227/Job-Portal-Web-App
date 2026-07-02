import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getCandidateProfile,
  updateCandidateProfile,
} from '../services/candidateProfile.service.js';

const getCandidateProfileHandler = asyncHandler(async (req, res) => {
  const user = await getCandidateProfile(req.user.userId);

  sendSuccess(res, HTTP_STATUS.OK, 'Candidate profile fetched successfully', {
    profile: user.profile,
  });
});

const updateCandidateProfileHandler = asyncHandler(async (req, res) => {
  const user = await updateCandidateProfile({ candidateId: req.user.userId, payload: req.body });

  sendSuccess(res, HTTP_STATUS.OK, 'Candidate profile updated successfully', {
    profile: user.profile,
  });
});

export { getCandidateProfileHandler, updateCandidateProfileHandler };
