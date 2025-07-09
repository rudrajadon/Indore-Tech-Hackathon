const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require('cloudinary').v2;
const { authenticateJWT, requireAdmin } = require('../middleware/auth');

// Cloudinary config
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'indore-reports',
    allowed_formats: ['jpg', 'jpeg', 'png'],
    public_id: (req, file) => Date.now() + '-' + file.originalname.replace(/\s/g, ''),
  },
});
const upload = multer({ storage });

// ---------- User Routes ---------- //

// Submit report (with photo)
router.post('/', authenticateJWT, upload.single('photo'), reportController.createReport);

// Get current user's own reports
router.get('/my', authenticateJWT, reportController.getUserReports);

// User: Submit feedback for own report
router.patch('/:reportId/feedback', authenticateJWT, reportController.userFeedback);

// ---------- Admin Routes ---------- //

// Get all reports
router.get('/', authenticateJWT, requireAdmin, reportController.getAllReports);

// Get report by ID
router.get('/:reportId', authenticateJWT, requireAdmin, reportController.getReportById);

// Update report status or remarks
router.patch('/:reportId', authenticateJWT, requireAdmin, reportController.updateReportStatus);

module.exports = router;