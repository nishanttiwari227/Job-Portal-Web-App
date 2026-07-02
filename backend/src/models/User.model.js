import mongoose from 'mongoose';
import { USER_ROLES } from '../constants/app.js';
import { hashPassword } from '../utils/password.js';

const profileSchema = new mongoose.Schema(
  {
    avatar: { type: String, default: '' },
    phone: { type: String, default: '', trim: true },
    bio: { type: String, default: '', trim: true, maxlength: 1000 },
    location: { type: String, default: '', trim: true },
    skills: { type: [String], default: [] },
    resumeUrl: { type: String, default: '' },
    resume: {
      url: { type: String, default: '', trim: true },
      publicId: { type: String, default: '', trim: true },
      originalFileName: { type: String, default: '', trim: true },
      uploadedAt: { type: Date, default: null },
    },
    companyName: { type: String, default: '', trim: true },
    companyWebsite: { type: String, default: '', trim: true },
    jobTitle: { type: String, default: '', trim: true },
    designation: { type: String, default: '', trim: true, maxlength: 100 },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      default: null,
    },
    headline: { type: String, default: '', trim: true, maxlength: 160 },
    experience: { type: Number, default: 0, min: 0, max: 50 },
    linkedin: { type: String, default: '', trim: true },
    portfolio: { type: String, default: '', trim: true },
    contactNumber: { type: String, default: '', trim: true, maxlength: 30 },
    officeLocation: { type: String, default: '', trim: true, maxlength: 200 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Name is required'],
      trim: true,
      minlength: [2, 'Name must be at least 2 characters'],
      maxlength: [100, 'Name cannot exceed 100 characters'],
    },
    email: {
      type: String,
      required: [true, 'Email is required'],
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    password: {
      type: String,
      required: [true, 'Password is required'],
      minlength: [8, 'Password must be at least 8 characters'],
      select: false,
    },
    role: {
      type: String,
      enum: Object.values(USER_ROLES),
      default: USER_ROLES.CANDIDATE,
      index: true,
    },
    isEmailVerified: {
      type: Boolean,
      default: false,
    },
    emailVerifiedAt: {
      type: Date,
      default: null,
    },
    emailVerificationTokenHash: {
      type: String,
      default: null,
      select: false,
    },
    emailVerificationTokenExpiresAt: {
      type: Date,
      default: null,
    },
    lastVerificationEmailSentAt: {
      type: Date,
      default: null,
    },
    refreshToken: {
      type: String,
      default: null,
      select: false,
    },
    tokenVersion: {
      type: Number,
      default: 0,
    },
    savedJobs: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Job',
      },
    ],
    profile: {
      type: profileSchema,
      default: () => ({}),
    },
  },
  {
    timestamps: true,
  }
);

userSchema.index({ role: 1, createdAt: -1 });

userSchema.pre('save', async function hashUserPassword(next) {
  if (!this.isModified('password')) {
    return next();
  }

  this.password = await hashPassword(this.password);
  next();
});

userSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    email: this.email,
    role: this.role,
    isEmailVerified: this.isEmailVerified,
    emailVerifiedAt: this.emailVerifiedAt,
    profile: this.profile,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const User = mongoose.model('User', userSchema);

export default User;
