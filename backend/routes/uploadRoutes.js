const express = require('express');
const { upload, uploadFile, uploadMultipleFiles } = require('../controllers/uploadController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.post('/', protect, upload.single('file'), uploadFile);
router.post('/multiple', protect, upload.array('files', 10), uploadMultipleFiles);

module.exports = router;
