import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import ApiError from '../utils/apiError.js';
import {
  uploadCandidateResume,
  deleteCandidateResume,
} from '../services/candidateResume.service.js';

const uploadCandidateResumeHandler = asyncHandler(async (req, res) => {
  if (!req.file) {
    throw ApiError.badRequest('Please upload a valid PDF file. File is missing or not a PDF.');
  }

  const user = await uploadCandidateResume({ candidateId: req.user.userId, file: req.file });

  sendSuccess(res, HTTP_STATUS.OK, 'Resume uploaded successfully', {
    resume: user.profile.resume,
  });
});

const deleteCandidateResumeHandler = asyncHandler(async (req, res) => {
  await deleteCandidateResume({ candidateId: req.user.userId });

  sendSuccess(res, HTTP_STATUS.OK, 'Resume deleted successfully');
});

export { uploadCandidateResumeHandler, deleteCandidateResumeHandler };