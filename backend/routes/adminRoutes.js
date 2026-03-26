const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth');
const { isAdmin, isSuperAdmin } = require('../middleware/admin');
const {
  getAllUsers,
  updateUserStatus,
  deleteUser,
  getDashboardStats,
  getReports,
  resolveReport,
  deletePost,
  deleteComment,
  sendAnnouncement,
  getActivityLogs,
  assignRole,
} = require('../controllers/adminController');

// All admin routes require authentication and admin role
router.use(protect);
router.use(isAdmin);

// Dashboard
router.get('/stats', getDashboardStats);

// User Management
router.get('/users', getAllUsers);
router.put('/users/:userId/status', updateUserStatus);
router.delete('/users/:userId', deleteUser);
router.put('/users/:userId/role', isSuperAdmin, assignRole);

// Reports
router.get('/reports', getReports);
router.put('/reports/:reportId/resolve', resolveReport);

// Content Moderation
router.delete('/posts/:postId', deletePost);
router.delete('/posts/:postId/comments/:commentId', deleteComment);

// Announcements
router.post('/announcements', sendAnnouncement);

// Activity Logs
router.get('/logs', getActivityLogs);

module.exports = router;