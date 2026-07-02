import HTTP_STATUS from '../constants/httpStatus.js';
import asyncHandler from '../utils/asyncHandler.js';
import { sendSuccess } from '../utils/apiResponse.js';
import {
  createCompany,
  updateCompany,
  getCompanyById,
  getCompanyBySlug,
  listCompanies,
  softDeleteCompany,
} from '../services/company.service.js';

const createCompanyHandler = asyncHandler(async (req, res) => {
  const company = await createCompany({ payload: req.body, ownerRecruiter: req.user.userId });

  sendSuccess(res, HTTP_STATUS.CREATED, 'Company created successfully', {
    company: company.toPublicJSON(),
  });
});

const updateCompanyHandler = asyncHandler(async (req, res) => {
  const company = await updateCompany({
    companyId: req.params.id,
    payload: req.body,
    actor: req.user,
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Company updated successfully', {
    company: company.toPublicJSON(),
  });
});

const getCompanyByIdHandler = asyncHandler(async (req, res) => {
  const company = await getCompanyById(req.params.id);

  sendSuccess(res, HTTP_STATUS.OK, 'Company fetched successfully', {
    company: company.toPublicJSON(),
  });
});

const getCompanyBySlugHandler = asyncHandler(async (req, res) => {
  const company = await getCompanyBySlug(req.params.slug);

  sendSuccess(res, HTTP_STATUS.OK, 'Company fetched successfully', {
    company: company.toPublicJSON(),
  });
});

const listCompaniesHandler = asyncHandler(async (req, res) => {
  const { page, limit, search } = req.query;
  const result = await listCompanies({
    page: Number(page) || 1,
    limit: Number(limit) || 20,
    search: search || '',
  });

  sendSuccess(res, HTTP_STATUS.OK, 'Companies listed successfully', result);
});

const softDeleteCompanyHandler = asyncHandler(async (req, res) => {
  await softDeleteCompany({ companyId: req.params.id, actor: req.user });

  sendSuccess(res, HTTP_STATUS.OK, 'Company deleted successfully');
});

export {
  createCompanyHandler,
  updateCompanyHandler,
  getCompanyByIdHandler,
  getCompanyBySlugHandler,
  listCompaniesHandler,
  softDeleteCompanyHandler,
};
