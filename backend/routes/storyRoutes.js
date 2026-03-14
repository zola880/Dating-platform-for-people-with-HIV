import express from 'express';
const {
  createStory,
  getStories,
  viewStory,
  deleteStory
} = '../controllers/storyController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getStories)
  .post(protect, createStory);

router.route('/:id')
  .delete(protect, deleteStory);

router.put('/:id/view', protect, viewStory);

export default router;
