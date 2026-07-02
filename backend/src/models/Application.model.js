import mongoose from 'mongoose';
import { APPLICATION_STATUSES_ARRAY } from '../constants/application.js';

const applicationSchema = new mongoose.Schema(
  {
    candidate: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Candidate reference is required'],
      index: true,
    },
    job: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Job',
      required: [true, 'Job reference is required'],
      index: true,
    },
    company: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Company',
      required: [true, 'Company reference is required'],
      index: true,
    },
    recruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Recruiter reference is required'],
      index: true,
    },
    resumeSnapshot: {
      url: { type: String, default: '' },
      publicId: { type: String, default: '' },
      originalFileName: { type: String, default: '' },
      uploadedAt: { type: Date, default: null },
    },
    status: {
      type: String,
      enum: APPLICATION_STATUSES_ARRAY,
      default: 'applied',
      index: true,
    },
    withdrawnAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

applicationSchema.index({ candidate: 1, job: 1 }, { unique: true });
applicationSchema.index({ recruiter: 1, job: 1 });
applicationSchema.index({ company: 1, status: 1 });

applicationSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    candidate: this.candidate,
    job: this.job,
    company: this.company,
    recruiter: this.recruiter,
    resumeSnapshot: this.resumeSnapshot,
    status: this.status,
    withdrawnAt: this.withdrawnAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Application = mongoose.model('Application', applicationSchema);

export default Application;
