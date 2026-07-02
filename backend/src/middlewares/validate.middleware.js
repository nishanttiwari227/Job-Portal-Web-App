import { validationResult } from 'express-validator';
import ApiError from '../utils/apiError.js';

const validate = (req, _res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    const formattedErrors = errors.array().map((error) => ({
      field: error.path,
      message: error.msg,
    }));

    return next(ApiError.unprocessable('Validation failed', formattedErrors));
  }

  next();
};

export default validate;
