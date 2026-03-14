import express from 'express';
const {
  getDashboardStats,
  toggleBanUser,
  getAllUsers,
  deletePostAdmin
} ='../controllers/adminController.js';
const { protect, admin } = '../middleware/auth.js';

const router = express.Router();

router.get('/stats', protect, admin, getDashboardStats);
router.get('/users', protect, admin, getAllUsers);
router.put('/users/:id/ban', protect, admin, toggleBanUser);
router.delete('/posts/:id', protect, admin, deletePostAdmin);

export default router;
