import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  uploadCandidateResume,
  deleteCandidateResume,
} from '../services/candidateResume.service.js';

const uploadCandidateResumeHandler = asyncHandler(async (req, res) => {
  const user = await uploadCandidateResume({ candidateId: req.user.userId, file: req.file });

  sendSuccess(res, HTTP_STATUS.OK, 'Resume uploaded successfully', {
    resume: user.profile.resume,
  });
});

const deleteCandidateResumeHandler = asyncHandler(async (_req, res) => {
  await deleteCandidateResume({ candidateId: req.user.userId });

  sendSuccess(res, HTTP_STATUS.OK, 'Resume deleted successfully');
});

export { uploadCandidateResumeHandler, deleteCandidateResumeHandler };
