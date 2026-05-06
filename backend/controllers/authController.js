const User = require('../models/User');
const jwt = require('jsonwebtoken');
const fs = require('fs');
const path = require('path');
const { updateUserInterests } = require('../utils/recommendation'); // Import recommendation utility

/**
 * Generate JWT Token
 * Creates a token with user ID that expires in 30 days
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: '30d',
  });
};

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
const registerUser = async (req, res) => {
  try {
    const { name, email, password, age, gender, bio, lookingFor } = req.body;

    // Check if user already exists
    const userExists = await User.findOne({ email });
    if (userExists) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'User already exists with this email' });
    }

    // Validate required fields
    if (!name || !email || !password || !age || !gender) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Handle profile picture
    let profilePicture = 'default-avatar.png';
    if (req.file) {
      profilePicture = req.file.filename;
    }

    // Prepare lookingFor (convert string to array if needed)
    let lookingForArray = ['Any'];
    if (lookingFor && lookingFor !== 'Any') {
      lookingForArray = [lookingFor];
    }

    // Create new user
    const user = await User.create({
      name,
      email,
      password,
      age,
      gender,
      bio: bio || '',
      profilePicture,
      lookingFor: lookingForArray,
    });

    // Extract interests from bio (and optionally from lookingFor? We'll just use bio)
    await updateUserInterests(user);

    // Return user data with token
    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      bio: user.bio,
      profilePicture: user.profilePicture,
      role: user.role,
      lookingFor: user.lookingFor,
      interests: user.interests,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Register error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Please provide email and password' });
    }

    const user = await User.findOne({ email }).select('+password');

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({ message: 'Invalid email or password' });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      age: user.age,
      gender: user.gender,
      bio: user.bio,
      profilePicture: user.profilePicture,
      role: user.role,
      lookingFor: user.lookingFor,
      interests: user.interests,
      token: generateToken(user._id),
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  registerUser,
  loginUser,
};