import Company from '../models/Company.model.js';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../constants/app.js';

const ALLOWED_UPDATE_FIELDS = ['name', 'description', 'website', 'industry', 'size', 'location', 'logo'];

const createCompany = async ({ payload, ownerRecruiter }) => {
  const company = await Company.create({
    ...payload,
    ownerRecruiter,
  });

  return company;
};

const updateCompany = async ({ companyId, payload, actor }) => {
  const company = await Company.findOne({ _id: companyId, isDeleted: false });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  if (actor.role !== USER_ROLES.ADMIN && company.ownerRecruiter.toString() !== actor.userId) {
    throw ApiError.forbidden('You do not have permission to update this company');
  }

  const updates = ALLOWED_UPDATE_FIELDS.reduce((acc, field) => {
    if (payload[field] !== undefined) {
      acc[field] = payload[field];
    }
    return acc;
  }, {});

  Object.assign(company, updates);
  await company.save();

  return company;
};

const getCompanyById = async (companyId) => {
  const company = await Company.findOne({ _id: companyId, isDeleted: false }).populate('ownerRecruiter', 'name email role');

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  return company;
};

const getCompanyBySlug = async (slug) => {
  const company = await Company.findOne({ slug, isDeleted: false }).populate('ownerRecruiter', 'name email role');

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  return company;
};

const listCompanies = async ({ page = 1, limit = 20, search = '' }) => {
  const query = { isDeleted: false };

  if (search) {
    query.$text = { $search: search };
  }

  const skip = (page - 1) * limit;
  const [companies, total] = await Promise.all([
    Company.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .populate('ownerRecruiter', 'name email role'),
    Company.countDocuments(query),
  ]);

  return {
    companies,
    pagination: {
      page,
      limit,
      total,
      pages: Math.ceil(total / limit),
    },
  };
};

const softDeleteCompany = async ({ companyId, actor }) => {
  const company = await Company.findOne({ _id: companyId, isDeleted: false });

  if (!company) {
    throw ApiError.notFound('Company not found');
  }

  if (actor.role !== 'admin' && company.ownerRecruiter.toString() !== actor.userId) {
    throw ApiError.forbidden('You do not have permission to delete this company');
  }

  company.isDeleted = true;
  company.deletedAt = new Date();
  await company.save();

  return company;
};

export {
  createCompany,
  updateCompany,
  getCompanyById,
  getCompanyBySlug,
  listCompanies,
  softDeleteCompany,
};
