import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
} from '../services/notification.service.js';

const listNotificationsHandler = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 20;

  const result = await getUserNotifications({ userId: req.user.userId, page, limit });

  sendSuccess(res, HTTP_STATUS.OK, 'Notifications retrieved successfully', result);
});

const markNotificationReadHandler = asyncHandler(async (req, res) => {
  const notification = await markNotificationRead({ userId: req.user.userId, notificationId: req.params.id });

  sendSuccess(res, HTTP_STATUS.OK, 'Notification marked as read', { notification });
});

const markAllNotificationsReadHandler = asyncHandler(async (req, res) => {
  await markAllNotificationsRead({ userId: req.user.userId });

  sendSuccess(res, HTTP_STATUS.OK, 'All notifications marked as read');
});

export {
  listNotificationsHandler,
  markNotificationReadHandler,
  markAllNotificationsReadHandler,
};
