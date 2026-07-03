import mongoose from 'mongoose';

const COMPANY_SIZES = [
  '1-10',
  '11-50',
  '51-200',
  '201-500',
  '501-1000',
  '1001+',
];

const createSlug = (value) =>
  value
    .toString()
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '') || Date.now().toString();

const companySchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Company name is required'],
      trim: true,
      minlength: [2, 'Company name must be at least 2 characters'],
      maxlength: [200, 'Company name cannot exceed 200 characters'],
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
      trim: true,
      maxlength: [2000, 'Description cannot exceed 2000 characters'],
      default: '',
    },
    website: {
      type: String,
      trim: true,
      default: '',
      validate: {
        validator: (value) => !value || /^https?:\/\/[\w\-]+(\.[\w\-]+)+([\w\-._~:\/?#\[\]@!$&'()*+,;=]+)?$/.test(value),
        message: 'Website must be a valid URL',
      },
    },
    industry: {
      type: String,
      trim: true,
      maxlength: [100, 'Industry cannot exceed 100 characters'],
      default: '',
    },
    size: {
      type: String,
      enum: COMPANY_SIZES,
      default: '1-10',
    },
    location: {
      type: String,
      trim: true,
      maxlength: [200, 'Location cannot exceed 200 characters'],
      default: '',
    },
    logo: {
      type: String,
      trim: true,
      default: '',
    },
    ownerRecruiter: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Owner recruiter is required'],
      index: true,
    },
    isVerified: {
      type: Boolean,
      default: false,
    },
    verifiedAt: {
      type: Date,
      default: null,
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

companySchema.index({ slug: 1 }, { unique: true });
companySchema.index({ ownerRecruiter: 1, isDeleted: 1 });
companySchema.index({ name: 'text', description: 'text', industry: 'text', location: 'text' });

companySchema.pre('validate', async function hashSlug(next) {
  if (!this.isModified('name') && this.slug) {
    return next();
  }

  let baseSlug = createSlug(this.name);
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

companySchema.methods.toPublicJSON = function toPublicJSON() {
  return {
    id: this._id,
    name: this.name,
    slug: this.slug,
    description: this.description,
    website: this.website,
    industry: this.industry,
    size: this.size,
    location: this.location,
    logo: this.logo,
    ownerRecruiter: this.ownerRecruiter,
    isVerified: this.isVerified,
    verifiedAt: this.verifiedAt,
    createdAt: this.createdAt,
    updatedAt: this.updatedAt,
  };
};

const Company = mongoose.model('Company', companySchema);

export default Company;
