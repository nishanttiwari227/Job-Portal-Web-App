import { param, query } from 'express-validator';

const jobIdValidationRules = [
  param('jobId')
    .trim()
    .notEmpty()
    .withMessage('Job id is required')
    .isMongoId()
    .withMessage('Invalid job id'),
];

const listSavedJobsValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export { jobIdValidationRules, listSavedJobsValidationRules };
