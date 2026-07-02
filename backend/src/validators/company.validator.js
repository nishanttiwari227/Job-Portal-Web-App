import { body, param, query } from 'express-validator';
import COMPANY_SIZES from '../constants/company.js';

const createCompanyValidationRules = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Company name is required')
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('website')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Website must be a valid URL'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('size')
    .optional()
    .isIn(COMPANY_SIZES)
    .withMessage('Size must be one of the allowed values'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('logo')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Logo must be a valid URL'),
];

const updateCompanyValidationRules = [
  body('name')
    .optional()
    .trim()
    .isLength({ min: 2, max: 200 })
    .withMessage('Company name must be between 2 and 200 characters'),
  body('description')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('Description cannot exceed 2000 characters'),
  body('website')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Website must be a valid URL'),
  body('industry')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Industry cannot exceed 100 characters'),
  body('size')
    .optional()
    .isIn(COMPANY_SIZES)
    .withMessage('Size must be one of the allowed values'),
  body('location')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Location cannot exceed 200 characters'),
  body('logo')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Logo must be a valid URL'),
];

const companyIdValidationRules = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Company id is required')
    .isMongoId()
    .withMessage('Invalid company id'),
];

const companySlugValidationRules = [
  param('slug')
    .trim()
    .notEmpty()
    .withMessage('Company slug is required'),
];

const listCompaniesValidationRules = [
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
];

export {
  createCompanyValidationRules,
  updateCompanyValidationRules,
  companyIdValidationRules,
  companySlugValidationRules,
  listCompaniesValidationRules,
};
