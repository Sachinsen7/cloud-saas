// Cloudinary folder that uploaded videos live in. Shared by the signature
// route (which signs it) and the save route (which verifies it).
export const VIDEO_FOLDER = 'saas-pro-videos-upload';

// Cloudinary's free plan caps video uploads at 100 MB.
export const MAX_VIDEO_SIZE_BYTES = 100 * 1024 * 1024;
