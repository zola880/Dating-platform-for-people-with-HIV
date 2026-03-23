const express = require('express');
const router = express.Router();
const {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
} = require('../controllers/postController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload'); // reuse the general upload middleware

// All post routes require authentication
router.use(protect);

// @route   GET /api/posts
// @desc    Get all posts
// @access  Private
router.get('/', getAllPosts);

// @route   POST /api/posts
// @desc    Create a new post (supports image/video)
// @access  Private
router.post('/', upload.single('image'), createPost); // field name 'image' matches frontend

// @route   GET /api/posts/:id
// @desc    Get single post
// @access  Private
router.get('/:id', getPostById);

// @route   PUT /api/posts/:id
// @desc    Update a post
// @access  Private
router.put('/:id', upload.single('image'), updatePost);

// @route   DELETE /api/posts/:id
// @desc    Delete a post
// @access  Private
router.delete('/:id', deletePost);

// @route   PUT /api/posts/:id/like
// @desc    Like a post
// @access  Private
router.put('/:id/like', likePost);

// @route   PUT /api/posts/:id/unlike
// @desc    Unlike a post
// @access  Private
router.put('/:id/unlike', unlikePost);

// @route   POST /api/posts/:id/comments
// @desc    Add comment to post
// @access  Private
router.post('/:id/comments', addComment);

// @route   DELETE /api/posts/:postId/comments/:commentId
// @desc    Delete a comment
// @access  Private
router.delete('/:postId/comments/:commentId', deleteComment);

module.exports = router;