const User = require('../models/User');
const Post = require('../models/Post');
const Message = require('../models/Message');
const Report = require('../models/Report');
const ActivityLog = require('../models/ActivityLog');

/**
 * @desc    Get dashboard statistics
 * @route   GET /api/admin/stats
 * @access  Private/Admin
 */
const getDashboardStats = async (req, res) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ status: 'active' });
    const suspendedUsers = await User.countDocuments({ status: 'suspended' });
    const bannedUsers = await User.countDocuments({ status: 'banned' });
    
    const totalPosts = await Post.countDocuments();
    const totalMessages = await Message.countDocuments();
    
    const pendingReports = await Report.countDocuments({ resolved: false });
    
    const recentUsers = await User.find()
      .sort({ createdAt: -1 })
      .limit(10)
      .select('name email role status createdAt');
    
    const recentPosts = await Post.find()
      .populate('user', 'name')
      .sort({ createdAt: -1 })
      .limit(10);
    
    res.json({
      users: {
        total: totalUsers,
        active: activeUsers,
        suspended: suspendedUsers,
        banned: bannedUsers,
      },
      content: {
        posts: totalPosts,
        messages: totalMessages,
      },
      reports: {
        pending: pendingReports,
      },
      recentUsers,
      recentPosts,
    });
  } catch (error) {
    console.error('Get dashboard stats error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all users with filters
 * @route   GET /api/admin/users
 * @access  Private/Admin
 */
const getAllUsers = async (req, res) => {
  try {
    const { status, role, search, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (status) query.status = status;
    if (role) query.role = role;
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } },
      ];
    }
    
    const users = await User.find(query)
      .select('-password')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await User.countDocuments(query);
    
    res.json({
      users,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update user status (suspend/ban/activate)
 * @route   PUT /api/admin/users/:userId/status
 * @access  Private/Admin
 */
const updateUserStatus = async (req, res) => {
  try {
    const { status, suspendedUntil, reason } = req.body;
    const { userId } = req.params;
    
    // Prevent admin from changing their own status
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own status' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.status = status;
    if (suspendedUntil) user.suspendedUntil = suspendedUntil;
    
    await user.save();
    
    // Log activity
    await ActivityLog.create({
      admin: req.user._id,
      action: `User ${status}`,
      target: userId,
      details: { status, reason },
    });
    
    res.json({ message: `User ${status} successfully`, user });
  } catch (error) {
    console.error('Update user status error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete user (permanent)
 * @route   DELETE /api/admin/users/:userId
 * @access  Private/SuperAdmin
 */
const deleteUser = async (req, res) => {
  try {
    const { userId } = req.params;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot delete yourself' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    // Delete all user data
    await Post.deleteMany({ user: userId });
    await Message.deleteMany({ $or: [{ sender: userId }, { receiver: userId }] });
    await user.deleteOne();
    
    await ActivityLog.create({
      admin: req.user._id,
      action: 'User deleted',
      target: userId,
      details: { userName: user.name, userEmail: user.email },
    });
    
    res.json({ message: 'User and all associated data deleted successfully' });
  } catch (error) {
    console.error('Delete user error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Assign role to user
 * @route   PUT /api/admin/users/:userId/role
 * @access  Private/SuperAdmin
 */
const assignRole = async (req, res) => {
  try {
    const { userId } = req.params;
    const { role } = req.body;
    
    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'You cannot change your own role' });
    }
    
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    
    user.role = role;
    await user.save();
    
    await ActivityLog.create({
      admin: req.user._id,
      action: `Role changed to ${role}`,
      target: userId,
      details: { role },
    });
    
    res.json({ message: 'User role updated successfully', user });
  } catch (error) {
    console.error('Assign role error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get all reports
 * @route   GET /api/admin/reports
 * @access  Private/Admin
 */
const getReports = async (req, res) => {
  try {
    const { resolved, type, page = 1, limit = 20 } = req.query;
    
    let query = {};
    if (resolved !== undefined) query.resolved = resolved === 'true';
    if (type) query.type = type;
    
    const reports = await Report.find(query)
      .populate('reportedBy', 'name email')
      .populate('targetUser', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await Report.countDocuments(query);
    
    res.json({
      reports,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get reports error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Resolve a report
 * @route   PUT /api/admin/reports/:reportId/resolve
 * @access  Private/Admin
 */
const resolveReport = async (req, res) => {
  try {
    const { reportId } = req.params;
    const { actionTaken } = req.body;
    
    const report = await Report.findById(reportId);
    if (!report) {
      return res.status(404).json({ message: 'Report not found' });
    }
    
    report.resolved = true;
    report.resolvedAt = new Date();
    report.resolvedBy = req.user._id;
    report.actionTaken = actionTaken;
    
    await report.save();
    
    await ActivityLog.create({
      admin: req.user._id,
      action: 'Report resolved',
      target: report.targetUser,
      details: { reportId, actionTaken },
    });
    
    res.json({ message: 'Report resolved successfully', report });
  } catch (error) {
    console.error('Resolve report error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a post (admin)
 * @route   DELETE /api/admin/posts/:postId
 * @access  Private/Admin
 */
const deletePost = async (req, res) => {
  try {
    const { postId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    await post.deleteOne();
    
    await ActivityLog.create({
      admin: req.user._id,
      action: 'Post deleted',
      target: post.user,
      details: { postId, postContent: post.content },
    });
    
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a comment (admin)
 * @route   DELETE /api/admin/posts/:postId/comments/:commentId
 * @access  Private/Admin
 */
const deleteComment = async (req, res) => {
  try {
    const { postId, commentId } = req.params;
    
    const post = await Post.findById(postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    
    const comment = post.comments.id(commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }
    
    comment.deleteOne();
    await post.save();
    
    await ActivityLog.create({
      admin: req.user._id,
      action: 'Comment deleted',
      target: comment.user,
      details: { postId, commentId, commentText: comment.text },
    });
    
    res.json({ message: 'Comment deleted successfully' });
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Send system-wide announcement
 * @route   POST /api/admin/announcements
 * @access  Private/Admin
 */
const sendAnnouncement = async (req, res) => {
  try {
    const { title, message, audience } = req.body;
    
    // Store announcement in database
    const announcement = await Announcement.create({
      title,
      message,
      audience: audience || 'all',
      createdBy: req.user._id,
    });
    
    // Here you could also emit socket event for real-time notifications
    // io.emit('announcement', announcement);
    
    await ActivityLog.create({
      admin: req.user._id,
      action: 'Announcement sent',
      details: { title, message, audience },
    });
    
    res.json({ message: 'Announcement sent successfully', announcement });
  } catch (error) {
    console.error('Send announcement error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get activity logs
 * @route   GET /api/admin/logs
 * @access  Private/Admin
 */
const getActivityLogs = async (req, res) => {
  try {
    const { page = 1, limit = 50, action } = req.query;
    
    let query = {};
    if (action) query.action = { $regex: action, $options: 'i' };
    
    const logs = await ActivityLog.find(query)
      .populate('admin', 'name email')
      .populate('target', 'name email')
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit));
    
    const total = await ActivityLog.countDocuments(query);
    
    res.json({
      logs,
      total,
      page: parseInt(page),
      pages: Math.ceil(total / limit),
    });
  } catch (error) {
    console.error('Get activity logs error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getDashboardStats,
  getAllUsers,
  updateUserStatus,
  deleteUser,
  assignRole,
  getReports,
  resolveReport,
  deletePost,
  deleteComment,
  sendAnnouncement,
  getActivityLogs,
};