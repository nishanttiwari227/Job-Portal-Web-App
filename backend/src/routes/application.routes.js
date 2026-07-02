import express from 'express';
import * as applicationController from '../controllers/application.controller.js';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import { USER_ROLES } from '../constants/app.js';
import {
  createApplicationValidationRules,
  idValidationRules,
  jobIdValidationRules,
  listApplicationsValidationRules,
  updateApplicationStatusValidationRules,
} from '../validators/application.validator.js';

const router = express.Router();

router.post(
  '/apply',
  authenticate,
  authorize([USER_ROLES.CANDIDATE]),
  createApplicationValidationRules,
  applicationController.applyToJob
);

router.get(
  '/me',
  authenticate,
  authorize([USER_ROLES.CANDIDATE]),
  listApplicationsValidationRules,
  applicationController.listMyApplications
);

router.patch(
  '/:id/withdraw',
  authenticate,
  authorize([USER_ROLES.CANDIDATE]),
  idValidationRules,
  applicationController.withdrawApplication
);

router.get(
  '/job/:jobId',
  authenticate,
  authorize([USER_ROLES.RECRUITER]),
  jobIdValidationRules,
  listApplicationsValidationRules,
  applicationController.listJobApplications
);

router.patch(
  '/:id/status',
  authenticate,
  authorize([USER_ROLES.RECRUITER]),
  idValidationRules,
  updateApplicationStatusValidationRules,
  applicationController.updateApplicationStatus
);

export default router;
