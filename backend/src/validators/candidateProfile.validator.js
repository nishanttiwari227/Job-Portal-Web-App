import { body } from 'express-validator';

const updateCandidateProfileValidationRules = [
  body('headline')
    .optional()
    .trim()
    .isLength({ max: 160 })
    .withMessage('Headline cannot exceed 160 characters'),
  body('about')
    .optional()
    .trim()
    .isLength({ max: 2000 })
    .withMessage('About cannot exceed 2000 characters'),
  body('education')
    .optional()
    .isArray()
    .withMessage('Education must be an array'),
  body('experience')
    .optional()
    .isArray()
    .withMessage('Experience must be an array'),
  body('skills')
    .optional()
    .isArray()
    .withMessage('Skills must be an array of strings'),
  body('projects')
    .optional()
    .isArray()
    .withMessage('Projects must be an array'),
  body('certifications')
    .optional()
    .isArray()
    .withMessage('Certifications must be an array'),
  body('socialLinks')
    .optional()
    .isObject()
    .withMessage('Social links must be an object'),
  body('socialLinks.linkedin')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('LinkedIn must be a valid URL'),
  body('socialLinks.github')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('GitHub must be a valid URL'),
  body('socialLinks.portfolio')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Portfolio must be a valid URL'),
  body('currentLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Current location cannot exceed 200 characters'),
  body('preferredLocation')
    .optional()
    .trim()
    .isLength({ max: 200 })
    .withMessage('Preferred location cannot exceed 200 characters'),
  body('expectedCTC')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Expected CTC cannot exceed 50 characters'),
  body('noticePeriod')
    .optional()
    .trim()
    .isLength({ max: 50 })
    .withMessage('Notice period cannot exceed 50 characters'),
  body('resume')
    .optional()
    .isObject()
    .withMessage('Resume must be an object with metadata'),
  body('resume.url')
    .optional()
    .trim()
    .isURL({ require_protocol: true })
    .withMessage('Resume URL must be a valid URL'),
  body('resume.publicId')
    .optional()
    .trim()
    .isString()
    .withMessage('Resume publicId must be a string'),
  body('resume.fileName')
    .optional()
    .trim()
    .isString()
    .withMessage('Resume fileName must be a string'),
];

export { updateCandidateProfileValidationRules };
