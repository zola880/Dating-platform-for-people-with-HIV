const express = require('express');
const {
  getDashboardStats,
  toggleBanUser,
  getAllUsers,
  deletePostAdmin
} = require('../controllers/adminController.js');
const { protect, admin } = require('../middleware/auth.js');

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, toggleBanUser);
router.delete('/posts/:id', protect, admin, deletePostAdmin);

module.exports = router;
