const User = require('../models/User');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Get all users (for browsing)
 * @route   GET /api/users
 * @access  Private
 */
const getAllUsers = async (req, res) => {
  try {
    // Get all users except the currently logged in user
    const users = await User.find({ _id: { $ne: req.user._id } })
      .select('-password') // Exclude password field
      .sort({ createdAt: -1 }); // Newest users first

    res.json(users);
  } catch (error) {
    console.error('Get all users error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get single user by ID
 * @route   GET /api/users/:id
 * @access  Private
 */
const getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password');

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Get user by ID error:', error);
    
    // Check if error is due to invalid ObjectId format
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/:id
 * @access  Private
 */
const updateUser = async (req, res) => {
  try {
    // Check if user is updating their own profile
    if (req.params.id !== req.user._id.toString()) {
      // If file was uploaded but user not authorized, delete it
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(403).json({ message: 'You can only update your own profile' });
    }

    // Find user
    const user = await User.findById(req.params.id);
    
    if (!user) {
      if (req.file) {
        fs.unlinkSync(req.file.path);
      }
      return res.status(404).json({ message: 'User not found' });
    }

    // Update fields that are provided
    const updateFields = ['name', 'age', 'gender', 'bio'];
    updateFields.forEach(field => {
      if (req.body[field] !== undefined) {
        user[field] = req.body[field];
      }
    });

    // Handle profile picture update
    if (req.file) {
      // Delete old profile picture if it's not the default avatar
      if (user.profilePicture && user.profilePicture !== 'default-avatar.png') {
        const oldPicturePath = path.join(__dirname, '../uploads', user.profilePicture);
        if (fs.existsSync(oldPicturePath)) {
          fs.unlinkSync(oldPicturePath);
        }
      }
      user.profilePicture = req.file.filename;
    }

    // Save updated user
    const updatedUser = await user.save();

    // Return updated user data without password
    res.json({
      _id: updatedUser._id,
      name: updatedUser.name,
      email: updatedUser.email,
      age: updatedUser.age,
      gender: updatedUser.gender,
      bio: updatedUser.bio,
      profilePicture: updatedUser.profilePicture,
    });
  } catch (error) {
    console.error('Update user error:', error);
    
    // If file was uploaded but there was an error, delete it
    if (req.file) {
      fs.unlinkSync(req.file.path);
    }
    
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  getAllUsers,
  getUserById,
  updateUser,
};