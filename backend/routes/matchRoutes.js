const express = require('express');
const {
  sendMatchRequest,
  respondToMatch,
  getMatches,
  getPendingMatches
} = require('../controllers/matchController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.get('/', protect, getMatches);
router.get('/pending', protect, getPendingMatches);
router.post('/:userId', protect, sendMatchRequest);
router.put('/:matchId', protect, respondToMatch);

module.exports = router;
