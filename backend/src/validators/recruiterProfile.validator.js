import { body } from 'express-validator';

const updateRecruiterProfileValidationRules = [
  body('designation')
    .optional()
    .trim()
    .isLength({ max: 100 })
    .withMessage('Designation cannot exceed 100 characters'),
  body('company')
    .optional()
    .isMongoId()
    .withMessage('Company must be a valid id'),
  body('headline')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Headline cannot exceed 160 characters'),
  body('experience')
    .optional()
    .isInt({ min: 0, max: 50 })
    .withMessage('Experience must be a whole number between 0 and 50'),
  body('linkedin')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('LinkedIn profile must be a valid URL'),
  body('portfolio')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Portfolio URL must be valid'),
  body('contactNumber')
    .optional()
    .trim()
    .isLength({ max: 30 })
    .withMessage('Contact number cannot exceed 30 characters'),
  body('officeLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Office location cannot exceed 200 characters'),
];

export { updateRecruiterProfileValidationRules };
