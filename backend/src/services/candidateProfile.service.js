import User from '../models/User.model.js';
import ApiError from '../utils/apiError.js';
import { USER_ROLES } from '../constants/app.js';

const getCandidateProfile = async (candidateId) => {
  const user = await User.findById(candidateId).select('-password -refreshToken -emailVerificationTokenHash -tokenVersion');

  if (!user || user.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate profile not found');
  }

  return user;
};

const updateCandidateProfile = async ({ candidateId, payload }) => {
  const user = await User.findById(candidateId);

  if (!user || user.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate profile not found');
  }

  const profileUpdates = {
    headline: payload.headline,
    about: payload.about,
    education: payload.education,
    experience: payload.experience,
    skills: payload.skills,
    projects: payload.projects,
    certifications: payload.certifications,
    socialLinks: payload.socialLinks,
    currentLocation: payload.currentLocation,
    preferredLocation: payload.preferredLocation,
    expectedCTC: payload.expectedCTC,
    noticePeriod: payload.noticePeriod,
    resume: payload.resume,
  };

  user.profile = {
    ...user.profile?.toObject?.(),
    ...profileUpdates,
  };

  await user.save();

  return user;
};

export { getCandidateProfile, updateCandidateProfile };
