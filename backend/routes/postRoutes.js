import express from 'express';
const {
  createPost,
  getPosts,
  getPost,
  likePost,
  commentOnPost,
  deletePost
} = '../controllers/postController.js';
const { protect } = '../middleware/auth.js';
const { validatePost, handleValidationErrors } = '../middleware/validation.js';

const router = express.Router();

router.route('/')
  .get(protect, getPosts)
  .post(protect, validatePost, handleValidationErrors, createPost);

router.route('/:id')
  .get(protect, getPost)
  .delete(protect, deletePost);

router.put('/:id/like', protect, likePost);
router.post('/:id/comment', protect, commentOnPost);

export default router;
