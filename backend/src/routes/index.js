import { Router } from 'express';
import { API_PREFIX } from '../constants/app.js';
import authRoutes from './auth.routes.js';
import healthRoutes from './health.routes.js';
import companyRoutes from './company.routes.js';
import recruiterProfileRoutes from './recruiterProfile.routes.js';

const router = Router();

router.use(`${API_PREFIX}/health`, healthRoutes);
router.use(`${API_PREFIX}/auth`, authRoutes);
router.use(`${API_PREFIX}/companies`, companyRoutes);
router.use(`${API_PREFIX}/recruiter`, recruiterProfileRoutes);

export default router;
