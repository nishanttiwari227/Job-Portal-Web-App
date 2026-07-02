import { body, query } from 'express-validator';
import { USER_ROLES } from '../constants/app.js';

const nameValidation = body('name')
  .trim()
  .notEmpty()
  .withMessage('Name is required')
  .isLength({ min: 2, max: 100 })
  .withMessage('Name must be between 2 and 100 characters');

const emailValidation = body('email')
  .trim()
  .notEmpty()
  .withMessage('Email is required')
  .isEmail()
  .withMessage('A valid email address is required')
  .normalizeEmail();

const passwordValidation = body('password')
  .notEmpty()
  .withMessage('Password is required')
  .isLength({ min: 8, max: 128 })
  .withMessage('Password must be between 8 and 128 characters')
  .matches(/[a-z]/)
  .withMessage('Password must contain at least one lowercase letter')
  .matches(/[A-Z]/)
  .withMessage('Password must contain at least one uppercase letter')
  .matches(/\d/)
  .withMessage('Password must contain at least one number');

const registerValidationRules = [
  nameValidation,
  emailValidation,
  passwordValidation,
  body('role')
    .notEmpty()
    .withMessage('Role is required')
    .isIn([USER_ROLES.CANDIDATE, USER_ROLES.RECRUITER])
    .withMessage('Role must be either candidate or recruiter'),
];

const loginValidationRules = [emailValidation, passwordValidation];

const resendVerificationValidationRules = [emailValidation];

const verifyEmailValidationRules = [
  query('token')
    .trim()
    .notEmpty()
    .withMessage('Verification token is required'),
];

export {
  registerValidationRules,
  loginValidationRules,
  resendVerificationValidationRules,
  verifyEmailValidationRules,
};
