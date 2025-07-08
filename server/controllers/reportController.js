const Report = require('../models/Report');

exports.createReport = async (req, res) => {
  try {
    const { location, address, description } = req.body;
    let photoPath = '';
    if (req.file) {
      photoPath = '/uploads/' + req.file.filename;
    }
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
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ user: req.user.id }).sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.getAllReports = async (req, res) => {
  try {
    const reports = await Report.find().populate('user', 'email').sort({ createdAt: -1 });
    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
};

exports.updateReportStatus = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { status, adminRemarks } = req.body;
    let report = await Report.findById(reportId);
    if (!report) return res.status(404).json({ message: 'Report not found' });
    report.status = status || report.status;
    report.adminRemarks = adminRemarks || report.adminRemarks;
    await report.save();
    // Populate user before returning
    report = await report.populate('user', 'email');
    res.json({ message: 'Report updated', report });
  } catch (err) {
    res.status(500).json({ message: 'Server error' });
  }
}; 