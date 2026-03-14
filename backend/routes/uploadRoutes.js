import express from 'express';
const { upload, uploadFile, uploadMultipleFiles } = '../controllers/uploadController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);
router.post('/multiple', protect, upload.array('files', 10), uploadMultipleFiles);

export default router;
