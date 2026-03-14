import express from 'express';
const {
  sendMatchRequest,
  respondToMatch,
  getMatches,
  getPendingMatches
} = '../controllers/matchController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.get('/', protect, getMatches);
router.get('/pending', protect, getPendingMatches);
router.post('/:userId', protect, sendMatchRequest);
router.put('/:matchId', protect, respondToMatch);

export default router;
