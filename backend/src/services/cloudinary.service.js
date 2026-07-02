import fs from 'fs';
import cloudinary from '../config/cloudinary.js';
import logger from '../utils/logger.js';
import ApiError from '../utils/apiError.js';
import httpStatus from '../constants/httpStatus.js';

/**
 * Uploads a local file to Cloudinary and deletes the local copy.
 * 
 * @param {string} localFilePath - The absolute path of the file to upload (usually from multer)
 * @param {string} folder - The target folder name (e.g., 'profile_images', 'company_logos', 'resumes')
 * @param {string} resourceType - Type of resource ('auto', 'image', 'raw' for PDFs)
 * @returns {Promise<Object>} - Cloudinary upload response object
 */
const uploadFile = async (localFilePath, folder, resourceType = 'auto') => {
  try {
    if (!localFilePath) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'File path is required for upload');
    }

    const response = await cloudinary.uploader.upload(localFilePath, {
      folder: `job_portal/${folder}`,
      resource_type: resourceType,
    });

    // Clean up local temporary file after successful upload
    if (fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }

    return response;
  } catch (error) {
    // Ensure local file is removed even if upload fails to prevent server storage bloat
    if (localFilePath && fs.existsSync(localFilePath)) {
      fs.unlinkSync(localFilePath);
    }
    
    logger.error(`Cloudinary upload error: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      'Failed to upload file to cloud storage'
    );
  }
};

/**
 * Deletes a file from Cloudinary using its public ID.
 * 
 * @param {string} publicId - The Cloudinary public ID of the resource
 * @param {string} resourceType - Type of resource ('image', 'raw', 'video')
 * @returns {Promise<Object>} - Cloudinary deletion response
 */
const deleteFile = async (publicId, resourceType = 'image') => {
  try {
    if (!publicId) {
      throw new ApiError(httpStatus.BAD_REQUEST, 'Public ID is required for deletion');
    }

    const response = await cloudinary.uploader.destroy(publicId, {
      resource_type: resourceType,
    });

    return response;
  } catch (error) {
    logger.error(`Cloudinary delete error: ${error.message}`);
    throw new ApiError(
      httpStatus.INTERNAL_SERVER_ERROR, 
      'Failed to delete file from cloud storage'
    );
  }
};

export const cloudinaryService = {
  uploadFile,
  deleteFile,
};