const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { sendMessage, getMessages, getConversations } = require('../controllers/messageController');
const { protect } = require('../middleware/auth');

router.use(protect);

router.get('/conversations', getConversations);
router.post('/', upload.array('attachments', 5), sendMessage);
router.get('/:userId', getMessages);

module.exports = router;