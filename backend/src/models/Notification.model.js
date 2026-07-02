import mongoose from 'mongoose';

const notificationSchema = new mongoose.Schema(
  {
    recipient: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recipient is required'],
      index: true,
    },
    sender: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      default: null,
    },
    type: {
      type: String,
      required: [true, 'Notification type is required'],
      trim: true,
    },
    title: {
      type: String,
      required: [true, 'Notification title is required'],
      trim: true,
      maxlength: [200, 'Title cannot exceed 200 characters'],
    },
    message: {
      type: String,
      required: [true, 'Notification message is required'],
      trim: true,
      maxlength: [2000, 'Message cannot exceed 2000 characters'],
    },
    relatedEntityType: {
      type: String,
      trim: true,
      default: '',
    },
    relatedEntityId: {
      type: String,
      trim: true,
      default: '',
    },
    isRead: {
      type: Boolean,
      default: false,
      index: true,
    },
  },
  {
    timestamps: true,
  }
);

notificationSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    recipient: this.recipient,
    sender: this.sender,
    type: this.type,
    title: this.title,
    message: this.message,
    relatedEntityType: this.relatedEntityType,
    relatedEntityId: this.relatedEntityId,
    isRead: this.isRead,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Notification = mongoose.model('Notification', notificationSchema);

export default Notification;
