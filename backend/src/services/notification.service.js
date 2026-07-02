import Notification from '../models/Notification.model.js';
import ApiError from '../utils/apiError.js';

const createNotification = async ({
  recipientId,
  senderId = null,
  type,
  title,
  message,
  relatedEntityType = '',
  relatedEntityId = '',
}) => {
  if (!recipientId || !type || !title || !message) {
    throw ApiError.badRequest('Notification recipient, type, title, and message are required');
  }

  const notification = await Notification.create({
    recipient: recipientId,
    sender: senderId,
    type,
    title,
    message,
    relatedEntityType,
    relatedEntityId,
  });

  return notification;
};

const getUserNotifications = async ({ userId, page = 1, limit = 20 }) => {
  const skip = (page - 1) * limit;
  const [notifications, total] = await Promise.all([
    Notification.find({ recipient: userId })
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('sender', 'name email')
      .populate('recipient', 'name email'),
    Notification.countDocuments({ recipient: userId }),
  ]);

  return {
    notifications,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const markNotificationRead = async ({ userId, notificationId }) => {
  const notification = await Notification.findOne({ _id: notificationId, recipient: userId });
  if (!notification) {
    throw ApiError.notFound('Notification not found');
  }

  if (!notification.isRead) {
    notification.isRead = true;
    await notification.save();
  }

  return notification;
};

const markAllNotificationsRead = async ({ userId }) => {
  await Notification.updateMany({ recipient: userId, isRead: false }, { isRead: true });
};

export {
  createNotification,
  getUserNotifications,
  markNotificationRead,
  markAllNotificationsRead,
};
