import { Router } from 'express';
import authenticate from '../middlewares/authenticate.middleware.js';
import authorize from '../middlewares/authorize.middleware.js';
import {
  createCompanyHandler,
  updateCompanyHandler,
  getCompanyByIdHandler,
  getCompanyBySlugHandler,
  listCompaniesHandler,
  softDeleteCompanyHandler,
} from '../controllers/company.controller.js';
import validate from '../middlewares/validate.middleware.js';
import {
  createCompanyValidationRules,
  updateCompanyValidationRules,
  companyIdValidationRules,
  companySlugValidationRules,
  listCompaniesValidationRules,
} from '../validators/company.validator.js';
import { USER_ROLES } from '../constants/app.js';

const router = Router();

router.post(
  '/',
  authenticate,
  authorize(USER_ROLES.RECRUITER),
  createCompanyValidationRules,
  validate,
  createCompanyHandler
);

router.get('/', listCompaniesValidationRules, validate, listCompaniesHandler);

router.get('/slug/:slug', companySlugValidationRules, validate, getCompanyBySlugHandler);

router.get('/:id', companyIdValidationRules, validate, getCompanyByIdHandler);

router.put(
  '/:id',
  authenticate,
  authorize(USER_ROLES.RECRUITER, USER_ROLES.ADMIN),
  companyIdValidationRules,
  updateCompanyValidationRules,
  validate,
  updateCompanyHandler
);

router.delete(
  '/:id',
  authenticate,
  authorize(USER_ROLES.RECRUITER, USER_ROLES.ADMIN),
  companyIdValidationRules,
  validate,
  softDeleteCompanyHandler
);

export default router;
