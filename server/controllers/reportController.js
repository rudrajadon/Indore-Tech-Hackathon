const Report = require('../models/Report');

// Create report
exports.createReport = async (req, res) => {
  try {
    const { location, address, description } = req.body;
    let photoPath = '';
    if (req.file && req.file.path) photoPath = req.file.path; // Cloudinary URL

    const report = new Report({
      user: req.user.id,
      location: JSON.parse(location),
      address,
      photo: photoPath,
      description,
    });
    await report.save();

    res.status(201).json({ message: 'Report submitted', report });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error during report submission' });
  }
};

// Get user's reports
exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch reports' });
  }
};

// Admin: Get all reports
exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user', 'email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Failed to fetch all reports' });
  }
};

// Admin: Get single report by ID
exports.getReportById = async (req, res) => {
  try {
    const report = await Report.findById(req.params.reportId).populate('user', 'email');
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    res.json(report);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Failed to fetch report' });
  }
};

// Admin: Update report status/remarks/feedback
exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminRemarks, feedback } = req.body;

    let report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });

    if (status) report.status = status;
    if (adminRemarks !== undefined) report.adminRemarks = adminRemarks;
    if (feedback !== undefined) report.feedback = feedback;

    await report.save();

    report = await report.populate('user', 'email');
    res.json({ message: 'Report updated', report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to update report' });
  }
};

// User: Submit feedback for own report
exports.userFeedback = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { feedback } = req.body;
    const report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    if (String(report.user) !== String(req.user.id)) return res.status(403).json({ message: 'Forbidden' });

    report.feedback = feedback;
    await report.save();

    res.json({ message: 'Feedback submitted', report });
  } catch (err) {
    res.status(500).json({ message: 'Failed to submit feedback' });
  }
};