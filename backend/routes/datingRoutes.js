import express from 'express';
const  {
  getDatingPreferences,
  updateDatingPreferences,
  getDiscoverProfiles,
  likeUser,
  getLikesReceived,
  getMyLikes,
  getEnhancedRecommendations
} = '../controllers/datingController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.route('/preferences')
  .get(protect, getDatingPreferences)
  .post(protect, updateDatingPreferences);

router.get('/discover', protect, getDiscoverProfiles);
router.get('/recommendations', protect, getEnhancedRecommendations);
router.post('/like/:userId', protect, likeUser);
router.get('/likes-received', protect, getLikesReceived);
router.get('/my-likes', protect, getMyLikes);

export default router;
