import express from 'express';
import { authenticate } from '../middlewares/authenticate.middleware.js';
import { authorize } from '../middlewares/authorize.middleware.js';
import {
  getDashboardStatsHandler,
  getUsersHandler,
  updateUserStatusHandler,
  getCompaniesHandler,
  getJobsHandler,
  getApplicationsHandler
} from '../controllers/admin.controller.js';

const router = express.Router();

// Apply Auth & RBAC globally to all admin routes
router.use(authenticate, authorize('admin'));

router.get('/stats', getDashboardStatsHandler);
router.get('/users', getUsersHandler);
router.patch('/users/:id/status', updateUserStatusHandler);
router.get('/companies', getCompaniesHandler);
router.get('/jobs', getJobsHandler);
router.get('/applications', getApplicationsHandler);

export default router;