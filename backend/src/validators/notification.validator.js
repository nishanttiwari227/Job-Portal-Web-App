import { param, query } from 'express-validator';

const idValidationRules = [
  param('id')
    .trim()
    .notEmpty()
    .withMessage('Notification id is required')
    .isMongoId()
    .withMessage('Invalid notification id'),
];

const listNotificationsValidationRules = [
  query('page')
    .optional()
    .isInt({ min: 1 })
    .withMessage('Page must be a positive integer'),
  query('limit')
    .optional()
    .isInt({ min: 1, max: 100 })
    .withMessage('Limit must be between 1 and 100'),
];

export { idValidationRules, listNotificationsValidationRules };
