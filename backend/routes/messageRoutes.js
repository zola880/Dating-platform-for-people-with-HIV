import express from 'express';
const { getConversation, getConversations } = '../controllers/messageController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getConversations);
router.get('/:userId', protect, getConversation);

export default router;
