const express = require('express');
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  commentOnPost,
  deletePost
} = require('../controllers/postController.js');
const { protect } = require('../middleware/auth.js');
const { validatePost, handleValidationErrors } = require('../middleware/validation.js');

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, validatePost, handleValidationErrors, createPost);

router.route('/:id')
  .get(protect, getPost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

module.exports = router;
