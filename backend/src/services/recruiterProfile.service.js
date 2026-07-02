import User from '../models/User.model.js';
import Company from '../models/Company.model.js';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../constants/app.js';

const getRecruiterProfile = async (recruiterId) => {
  const user = await User.findById(recruiterId)
    .select('-password -refreshToken -emailVerificationTokenHash -tokenVersion')
    .populate('profile.company', 'name slug website industry location');

  if (!user || user.role !== USER_ROLES.RECRUITER) {
    throw ApiError.notFound('Recruiter profile not found');
  }

  return user;
};

const updateRecruiterProfile = async ({ recruiterId, payload }) => {
  const user = await User.findById(recruiterId);

  if (!user || user.role !== USER_ROLES.RECRUITER) {
    throw ApiError.notFound('Recruiter profile not found');
  }

  if (payload.company) {
    const companyExists = await Company.exists({ _id: payload.company, isDeleted: false });
    if (!companyExists) {
      throw ApiError.badRequest('Linked company not found');
    }
  }

  const profileUpdates = {
    designation: payload.designation,
    headline: payload.headline,
    experience: payload.experience,
    linkedin: payload.linkedin,
    portfolio: payload.portfolio,
    contactNumber: payload.contactNumber,
    officeLocation: payload.officeLocation,
  };

  user.profile = {
    ...user.profile?.toObject?.(),
    ...profileUpdates,
    company: payload.company || user.profile.company,
  };

  await user.save();

  return user;
};

export { getRecruiterProfile, updateRecruiterProfile };
