import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import { resumeUpload } from '../middlewares/resumeUpload.middleware.js';
import {
  uploadCandidateResumeHandler,
  deleteCandidateResumeHandler,
} from '../controllers/candidateResume.controller.js';

const router = Router();

router.use(authenticate, authorize(USER_ROLES.CANDIDATE));

router.post('/resume', resumeUpload.single('resume'), uploadCandidateResumeHandler);
router.delete('/resume', deleteCandidateResumeHandler);

export default router;
