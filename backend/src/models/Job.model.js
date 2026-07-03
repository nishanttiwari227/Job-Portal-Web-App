import mongoose from 'mongoose';
import {
  JOB_STATUSES_ARRAY,
  JOB_TYPES_ARRAY,
  WORK_MODES_ARRAY,
  EXPERIENCE_LEVELS_ARRAY,
} from '../constants/job.js';

const createSlug = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || Date.now().toString();

const salaryRangeSchema = new mongoose.Schema(
  {
    min: { type: Number, min: 0, default: 0 },
    max: { type: Number, min: 0, default: 0 },
    currency: { type: String, trim: true, default: 'USD' },
  },
  { _id: false }
);

const jobSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, 'Job title is required'],
      trim: true,
      minlength: [3, 'Job title must be at least 3 characters'],
      maxlength: [200, 'Job title cannot exceed 200 characters'],
    },
    slug: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
    },
    description: {
      type: String,
      required: [true, 'Job description is required'],
      trim: true,
      maxlength: [5000, 'Job description cannot exceed 5000 characters'],
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
      required: [true, 'Recruiter owner is required'],
      index: true,
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      default: '',
    },
    jobType: {
      type: String,
      enum: JOB_TYPES_ARRAY,
      default: JOB_TYPES_ARRAY[0],
      index: true,
    },
    workMode: {
      type: String,
      enum: WORK_MODES_ARRAY,
      default: WORK_MODES_ARRAY[0],
      index: true,
    },
    experienceLevel: {
      type: String,
      enum: EXPERIENCE_LEVELS_ARRAY,
      default: EXPERIENCE_LEVELS_ARRAY[0],
      index: true,
    },
    salaryRange: {
      type: salaryRangeSchema,
      default: () => ({}),
    },
    skills: {
      type: [String],
      default: [],
      index: true,
    },
    responsibilities: {
      type: [String],
      default: [],
    },
    benefits: {
      type: [String],
      default: [],
    },
    applicationDeadline: {
      type: Date,
      default: null,
    },
    status: {
      type: String,
      enum: JOB_STATUSES_ARRAY,
      default: 'draft',
      index: true,
    },
    isDeleted: {
      type: Boolean,
      default: false,
      index: true,
    },
    deletedAt: {
      type: Date,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

jobSchema.index({ slug: 1 }, { unique: true });
jobSchema.index({ title: 'text', description: 'text', skills: 'text' });
jobSchema.index({ company: 1, recruiter: 1, status: 1, isDeleted: 1 });
jobSchema.index({ location: 1, jobType: 1, workMode: 1, experienceLevel: 1 });

jobSchema.pre('validate', async function ensureSlug(next) {
  if (!this.isModified('title') && this.slug) {
    return next();
  }

  let baseSlug = createSlug(this.title);
  let candidate = baseSlug;
  let suffix = 1;

  while (
    await this.constructor.exists({
      slug: candidate,
      _id: { $ne: this._id },
    })
  ) {
    candidate = `${baseSlug}-${suffix++}`;
  }

  this.slug = candidate;
  next();
});

jobSchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    title: this.title,
    slug: this.slug,
    description: this.description,
    company: this.company,
    recruiter: this.recruiter,
    location: this.location,
    jobType: this.jobType,
    workMode: this.workMode,
    experienceLevel: this.experienceLevel,
    salaryRange: this.salaryRange,
    skills: this.skills,
    responsibilities: this.responsibilities,
    benefits: this.benefits,
    applicationDeadline: this.applicationDeadline,
    status: this.status,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Job = mongoose.model('Job', jobSchema);

export default Job;
