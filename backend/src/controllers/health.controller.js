import HTTP_STATUS from '../constants/httpStatus.js';
import { APP_NAME } from '../constants/app.js';
import asyncHandler from '../utils/asyncHandler.js';

const getHealth = asyncHandler(async (_req, res) => {
  res.status(HTTP_STATUS.OK).json({
    success: true,
    message: `${APP_NAME} is running`,
    timestamp: new Date().toISOString(),
  });
});

export { getHealth };
