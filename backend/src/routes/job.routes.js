import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import validate from '../middlewares/validate.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import {
  createJobHandler,
  updateJobHandler,
  deleteJobHandler,
  getJobByIdHandler,
  getJobBySlugHandler,
  listJobsHandler,
  getRecruiterJobsHandler,
} from '../controllers/job.controller.js';
import {
  createJobValidationRules,
  updateJobValidationRules,
  idValidationRules,
  slugValidationRules,
  listJobsValidationRules,
} from '../validators/job.validator.js';

const router = Router();

router.get('/', listJobsValidationRules, validate, listJobsHandler);
router.get('/slug/:slug', slugValidationRules, validate, getJobBySlugHandler);
router.get('/:id', idValidationRules, validate, getJobByIdHandler);

router.get(
  '/recruiter/me',
  authenticate,
  authorize(USER_ROLES.RECRUITER),
  listJobsValidationRules,
  validate,
  getRecruiterJobsHandler
);

router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.RECRUITER),
  createJobValidationRules,
  validate,
  createJobHandler
);

router.put(
  '/:id',
  authenticate,
  authorize(USER_ROLES.RECRUITER),
  idValidationRules,
  updateJobValidationRules,
  validate,
  updateJobHandler
);

router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.RECRUITER),
  idValidationRules,
  validate,
  deleteJobHandler
);

export default router;
