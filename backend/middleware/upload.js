const multer = require('multer');
const path = require('path');
const fs = require('fs');

const uploadDir = path.join(__dirname, '../uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
  console.log('Created uploads directory:', uploadDir);
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const filename = 'msg-' + uniqueSuffix + ext;
    console.log('Saving file:', filename);
    cb(null, filename);
  },
});

const fileFilter = (req, file, cb) => {
  console.log('Received file:', file.originalname, 'MIME type:', file.mimetype);
  
  // Allow all images and videos, plus PDF and text files
  const isImage = file.mimetype.startsWith('image/');
  const isVideo = file.mimetype.startsWith('video/');
  const isDocument = file.mimetype === 'application/pdf' || file.mimetype === 'text/plain';
  
  if (isImage || isVideo || isDocument) {
    cb(null, true);
  } else {
    cb(new Error(`Invalid file type: ${file.mimetype}. Only images, videos, PDFs, and text files are allowed.`));
  }
};

const upload = multer({
  storage: storage,
  limits: { fileSize: 15 * 1024 * 1024 }, // 15MB
  fileFilter: fileFilter,
});

module.exports = upload;