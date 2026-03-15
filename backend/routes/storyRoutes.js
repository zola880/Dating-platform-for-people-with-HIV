const express = require('express');
const {
  createStory,
  getStories,
  viewStory,
  deleteStory
} = require('../controllers/storyController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
  .get(protect, getStories)
  .post(protect, createStory);

router.route('/:id')
  .delete(protect, deleteStory);

router.put('/:id/view', protect, viewStory);

module.exports = router;
