import multer from 'multer';
import { config } from '../config.js';
import { isSupportedFileType } from '../services/documentParser.js';
// Use memoryStorage for serverless and cloud compatibility (no read-only disk writes)
const storage = multer.memoryStorage();
const fileFilter = (_req, file, cb) => {
    if (isSupportedFileType(file.mimetype, file.originalname)) {
        cb(null, true);
    }
    else {
        cb(new Error(`Unsupported file type: ${file.originalname}. Only JPG, PNG, WEBP, and PDF documents are allowed.`));
    }
};
export const uploadMiddleware = multer({
    storage,
    limits: {
        fileSize: config.upload.maxFileSize,
        files: config.upload.maxFiles
    },
    fileFilter
});
