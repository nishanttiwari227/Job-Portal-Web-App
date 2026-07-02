import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import {
  getRecruiterProfileHandler,
  updateRecruiterProfileHandler,
} from '../controllers/recruiterProfile.controller.js';
import { updateRecruiterProfileValidationRules } from '../validators/recruiterProfile.validator.js';

const router = Router();

router.use(authenticate, authorize(USER_ROLES.RECRUITER));

router.get('/profile', getRecruiterProfileHandler);
router.put('/profile', updateRecruiterProfileValidationRules, validate, updateRecruiterProfileHandler);

export default router;
