const express = require('express');
const {
  getUserProfile,
  updateProfile,
  searchUsers,
  getRecommendations,
  blockUser,
  unblockUser
} = require('../controllers/userController.js');

const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.get('/search', protect, searchUsers);
router.get('/recommendations', protect, getRecommendations);
router.get('/:id', protect, getUserProfile);
router.put('/profile', protect, updateProfile);
router.post('/block/:id', protect, blockUser);
router.delete('/block/:id', protect, unblockUser);

module.exports = router;