const express = require('express');
const  {
  getDatingPreferences,
  updateDatingPreferences,
  getDiscoverProfiles,
  likeUser,
  getLikesReceived,
  getMyLikes,
  getEnhancedRecommendations
} = require('../controllers/datingController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.route('/preferences')
  .get(protect, getDatingPreferences)
  .post(protect, updateDatingPreferences);

router.get('/discover', protect, getDiscoverProfiles);
router.get('/recommendations', protect, getEnhancedRecommendations);
router.post('/like/:userId', protect, likeUser);
router.get('/likes-received', protect, getLikesReceived);
router.get('/my-likes', protect, getMyLikes);

module.exports = router;
