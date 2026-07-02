import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import {
  getCandidateProfileHandler,
  updateCandidateProfileHandler,
} from '../controllers/candidateProfile.controller.js';
import { updateCandidateProfileValidationRules } from '../validators/candidateProfile.validator.js';

const router = Router();

router.use(authenticate, authorize(USER_ROLES.CANDIDATE));

router.get('/profile', getCandidateProfileHandler);
router.put('/profile', updateCandidateProfileValidationRules, validate, updateCandidateProfileHandler);

export default router;
