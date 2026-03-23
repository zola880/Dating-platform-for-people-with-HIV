const express = require('express');
const router = express.Router();
const { getAllUsers, getUserById, updateUser } = require('../controllers/userController');
const { protect } = require('../middleware/auth');
const upload = require('../middleware/upload');

// All user routes require authentication
router.use(protect);

// @route   GET /api/users
// @desc    Get all users (for browsing)
// @access  Private
router.get('/', getAllUsers);

// @route   GET /api/users/:id
// @desc    Get single user by ID
// @access  Private
router.get('/:id', getUserById);

// @route   PUT /api/users/:id
// @desc    Update user profile
// @access  Private
router.put('/:id', upload.single('profilePicture'), updateUser);

module.exports = router;