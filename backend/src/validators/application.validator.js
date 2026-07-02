import { body, param, query } from 'express-validator';
import { APPLICATION_STATUSES_ARRAY } from '../constants/application.js';

const createApplicationValidationRules = [
  body('job')
    .notEmpty()
    .withMessage('Job id is required')
    .isMongoId()
    .withMessage('Job id must be a valid id'),
];

const idValidationRules = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Application id is required')
    .isMongoId()
    .withMessage('Invalid application id'),
];

const jobIdValidationRules = [
  param('jobId')
    .trim()
    .notEmpty()
    .withMessage('Job id is required')
    .isMongoId()
    .withMessage('Invalid job id'),
];

const updateApplicationStatusValidationRules = [
  body('status')
    .notEmpty()
    .withMessage('Status is required')
    .isIn(APPLICATION_STATUSES_ARRAY)
    .withMessage('Invalid application status'),
];

const listApplicationsValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export {
  createApplicationValidationRules,
  idValidationRules,
  jobIdValidationRules,
  updateApplicationStatusValidationRules,
  listApplicationsValidationRules,
};
