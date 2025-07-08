const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');
const jwt = require('jsonwebtoken');
const multer = require('multer');
const path = require('path');

// Multer setup
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../uploads/'));
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    cb(null, uniqueSuffix + '-' + file.originalname);
  },
});
const upload = multer({ storage });

// JWT middleware
function authenticateJWT(req, res, next) {
  const authHeader = req.headers.authorization;
  if (authHeader && authHeader.startsWith('Bearer ')) {
    const token = authHeader.split(' ')[1];
    jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
      if (err) return res.sendStatus(403);
      req.user = user;
      next();
    });
  } else {
    res.sendStatus(401);
  }
}

// User: submit report (with file upload)
router.post('/', authenticateJWT, upload.single('photo'), reportController.createReport);
// User: view own reports
router.get('/my', authenticateJWT, reportController.getUserReports);
// Admin: view all reports
router.get('/', authenticateJWT, (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}, reportController.getAllReports);
// Admin: update report status
router.patch('/:reportId', authenticateJWT, (req, res, next) => {
  if (req.user.role !== 'admin') return res.sendStatus(403);
  next();
}, reportController.updateReportStatus);

module.exports = router; 