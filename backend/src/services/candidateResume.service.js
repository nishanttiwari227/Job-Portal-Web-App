import fs from 'fs';
import User from '../models/User.model.js';
import ApiError from '../utils/apiError.js';
import { cloudinaryService } from './cloudinary.service.js';
import { USER_ROLES } from '../constants/app.js';

const uploadCandidateResume = async ({ candidateId, file }) => {
  const user = await User.findById(candidateId);

  if (!user || user.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate profile not found');
  }

  if (!file) {
    throw ApiError.badRequest('Resume file is required');
  }

  if (user.profile?.resume?.publicId) {
    await cloudinaryService.deleteFile(user.profile.resume.publicId, 'raw');
  }

  const uploadResponse = await cloudinaryService.uploadFile(file.path, 'resumes', 'raw');

  // FIX: Cleanup local temp file to prevent memory leak
  if (fs.existsSync(file.path)) {
    fs.unlinkSync(file.path);
  }

  // FIX: Safe object spreading for Mongoose document
  user.profile = {
    ...(user.profile || {}),
    resume: {
      url: uploadResponse.secure_url,
      publicId: uploadResponse.public_id,
      originalFileName: file.originalname,
      uploadedAt: new Date(),
    },
  };

  await user.save();

  return user;
};

const deleteCandidateResume = async ({ candidateId }) => {
  const user = await User.findById(candidateId);

  if (!user || user.role !== USER_ROLES.CANDIDATE) {
    throw ApiError.notFound('Candidate profile not found');
  }

  if (!user.profile?.resume?.publicId) {
    throw ApiError.notFound('No resume found to delete');
  }

  await cloudinaryService.deleteFile(user.profile.resume.publicId, 'raw');

  user.profile = {
    ...(user.profile || {}),
    resume: null,
  };

  await user.save();

  return user;
};

export { uploadCandidateResume, deleteCandidateResume };