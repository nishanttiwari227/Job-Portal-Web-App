import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import {
  jobIdValidationRules,
  listSavedJobsValidationRules,
} from '../validators/savedJob.validator.js';
import {
  saveJobHandler,
  removeSavedJobHandler,
  listSavedJobsHandler,
} from '../controllers/savedJob.controller.js';

const router = Router();

router.use(authenticate, authorize(USER_ROLES.CANDIDATE));

router.post('/:jobId', jobIdValidationRules, validate, saveJobHandler);
router.delete('/:jobId', jobIdValidationRules, validate, removeSavedJobHandler);
router.get('/', listSavedJobsValidationRules, validate, listSavedJobsHandler);

export default router;
