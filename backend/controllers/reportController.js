const Report =require('../models/Report.js');

// @desc    Create report
// @route   POST /api/reports
// @access  Private
exports.createReport = async (req, res) => {
  try {
    const { reportedUser, reportedPost, reason } = req.body;

    const report = await Report.create({
      reporter: req.user._id,
      reportedUser,
      reportedPost,
      reason
    });

    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all reports (admin)
// @route   GET /api/reports
// @access  Private/Admin
exports.getReports = async (req, res) => {
  try {
    const reports = await Report.find()
      .populate('reporter', 'username email')
      .populate('reportedUser', 'username email')
      .populate('reportedPost')
      .sort({ createdAt: -1 });

    res.json(reports);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update report status (admin)
// @route   PUT /api/reports/:id
// @access  Private/Admin
exports.updateReport = async (req, res) => {
  try {
    const { status, adminNotes } = req.body;
    const report = await Report.findById(req.params.id);

    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }

    report.status = status || report.status;
    report.adminNotes = adminNotes || report.adminNotes;
    await report.save();

    res.json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
