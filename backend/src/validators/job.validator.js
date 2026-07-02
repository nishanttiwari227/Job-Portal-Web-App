import { body, param, query } from 'express-validator';
import { JOB_STATUSES_ARRAY, JOB_TYPES_ARRAY, WORK_MODES_ARRAY, EXPERIENCE_LEVELS_ARRAY } from '../constants/job.js';

const createJobValidationRules = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Job title is required')
    .isLength({ min: 3, max: 200 })
    .withMessage('Job title must be between 3 and 200 characters'),
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Job description is required')
    .isLength({ max: 5000 })
    .withMessage('Job description cannot exceed 5000 characters'),
  body('company')
    .notEmpty()
    .withMessage('Company is required')
    .isMongoId()
    .withMessage('Company must be a valid id'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('jobType')
    .optional()
    .isIn(JOB_TYPES_ARRAY)
    .withMessage('Job type is invalid'),
  body('workMode')
    .optional()
    .isIn(WORK_MODES_ARRAY)
    .withMessage('Work mode is invalid'),
  body('experienceLevel')
    .optional()
    .isIn(EXPERIENCE_LEVELS_ARRAY)
    .withMessage('Experience level is invalid'),
  body('salaryRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary minimum must be a non-negative number'),
  body('salaryRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary maximum must be a non-negative number'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array of strings'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array of strings'),
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Application deadline must be a valid date'),
  body('status')
    .optional()
    .isIn(JOB_STATUSES_ARRAY)
    .withMessage('Status is invalid'),
];

const updateJobValidationRules = [
  body('title')
    .optional()
    .trim()
    .isLength({ min: 3, max: 200 })
    .withMessage('Job title must be between 3 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 5000 })
    .withMessage('Job description cannot exceed 5000 characters'),
  body('company')
    .optional()
    .isMongoId()
    .withMessage('Company must be a valid id'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('jobType')
    .optional()
    .isIn(JOB_TYPES_ARRAY)
    .withMessage('Job type is invalid'),
  body('workMode')
    .optional()
    .isIn(WORK_MODES_ARRAY)
    .withMessage('Work mode is invalid'),
  body('experienceLevel')
    .optional()
    .isIn(EXPERIENCE_LEVELS_ARRAY)
    .withMessage('Experience level is invalid'),
  body('salaryRange.min')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary minimum must be a non-negative number'),
  body('salaryRange.max')
    .optional()
    .isFloat({ min: 0 })
    .withMessage('Salary maximum must be a non-negative number'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),
  body('responsibilities')
    .optional()
    .isArray()
    .withMessage('Responsibilities must be an array of strings'),
  body('benefits')
    .optional()
    .isArray()
    .withMessage('Benefits must be an array of strings'),
  body('applicationDeadline')
    .optional()
    .isISO8601()
    .toDate()
    .withMessage('Application deadline must be a valid date'),
  body('status')
    .optional()
    .isIn(JOB_STATUSES_ARRAY)
    .withMessage('Status is invalid'),
];

const idValidationRules = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Job id is required')
    .isMongoId()
    .withMessage('Invalid job id'),
];

const slugValidationRules = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Job slug is required'),
];

const listJobsValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
  query('search')
    .optional()
    .trim()
    .isString()
    .withMessage('Search must be a string'),
  query('location')
    .optional()
    .trim()
    .isString()
    .withMessage('Location must be a string'),
  query('jobType')
    .optional()
    .isIn(JOB_TYPES_ARRAY)
    .withMessage('Job type is invalid'),
  query('workMode')
    .optional()
    .isIn(WORK_MODES_ARRAY)
    .withMessage('Work mode is invalid'),
  query('experienceLevel')
    .optional()
    .isIn(EXPERIENCE_LEVELS_ARRAY)
    .withMessage('Experience level is invalid'),
  query('status')
    .optional()
    .isIn(JOB_STATUSES_ARRAY)
    .withMessage('Status is invalid'),
  query('sortBy')
    .optional()
    .isIn(['newest', 'deadline', 'salary'])
    .withMessage('Sort by invalid value'),
];

export {
  createJobValidationRules,
  updateJobValidationRules,
  idValidationRules,
  slugValidationRules,
  listJobsValidationRules,
};
