import express from 'express';
const {
  getNotifications,
  markAsRead,
  markAllAsRead
} = '../controllers/notificationController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getNotifications);
router.put('/read-all', protect, markAllAsRead);
router.put('/:id/read', protect, markAsRead);

export default router;
