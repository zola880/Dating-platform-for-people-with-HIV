const express = require('express');
const { getConversation, getConversations } = require('../controllers/messageController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', protect, getConversations);
router.get('/:userId', protect, getConversation);

module.exports = router;
