import { Router } from 'express';
import { API_PREFIX } from '../constants/app.js';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import companyRoutes from './company.routes.js';
import recruiterProfileRoutes from './recruiterProfile.routes.js';
import candidateProfileRoutes from './candidateProfile.routes.js';
import candidateResumeRoutes from './candidateResume.routes.js';
import jobRoutes from './job.routes.js';
import applicationRoutes from './application.routes.js';
import savedJobRoutes from './savedJob.routes.js';
import notificationRoutes from './notification.routes.js';
import adminRoutes from './admin.routes.js';

const router = Router();

router.use(`${API_PREFIX}/health`, healthRoutes);
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/companies`, companyRoutes);
router.use(`${API_PREFIX}/recruiter`, recruiterProfileRoutes);
router.use(`${API_PREFIX}/candidate`, candidateProfileRoutes);
router.use(`${API_PREFIX}/candidate`, candidateResumeRoutes);
router.use(`${API_PREFIX}/jobs`, jobRoutes);
router.use(`${API_PREFIX}/applications`, applicationRoutes);
router.use(`${API_PREFIX}/saved-jobs`, savedJobRoutes);
router.use(`${API_PREFIX}/notifications`, notificationRoutes);
router.use(`${API_PREFIX}/admin`, adminRoutes);

export default router;
