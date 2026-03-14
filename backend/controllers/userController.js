const User=require('../models/User.js');
const Match=require('../models/Match.js');

// @desc    Get user profile
// @route   GET /api/users/:id
// @access  Private
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.params.id).select('-password -blockedUsers');
    
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if requesting user is blocked
    if (user.blockedUsers.includes(req.user._id)) {
      return res.status(403).json({ message: 'Access denied' });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Update user profile
// @route   PUT /api/users/profile
// @access  Private
exports.updateProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.username = req.body.username || user.username;
      user.bio = req.body.bio !== undefined ? req.body.bio : user.bio;
      user.age = req.body.age || user.age;
      user.gender = req.body.gender || user.gender;
      user.country = req.body.country || user.country;
      user.interests = req.body.interests !== undefined ? req.body.interests : user.interests;
      user.hivStatusVisibility = req.body.hivStatusVisibility || user.hivStatusVisibility;
      user.isAnonymous = req.body.isAnonymous !== undefined ? req.body.isAnonymous : user.isAnonymous;
      user.profilePicture = req.body.profilePicture || user.profilePicture;
      user.lookingFor = req.body.lookingFor || user.lookingFor;
      user.relationshipStatus = req.body.relationshipStatus || user.relationshipStatus;
      user.occupation = req.body.occupation !== undefined ? req.body.occupation : user.occupation;
      user.education = req.body.education !== undefined ? req.body.education : user.education;
      user.hasChildren = req.body.hasChildren !== undefined ? req.body.hasChildren : user.hasChildren;
      user.wantsChildren = req.body.wantsChildren || user.wantsChildren;
      user.smoking = req.body.smoking || user.smoking;
      user.drinking = req.body.drinking || user.drinking;
      user.height = req.body.height || user.height;
      user.bodyType = req.body.bodyType || user.bodyType;
      user.ethnicity = req.body.ethnicity !== undefined ? req.body.ethnicity : user.ethnicity;
      user.religion = req.body.religion !== undefined ? req.body.religion : user.religion;
      user.languages = req.body.languages !== undefined ? req.body.languages : user.languages;

      const updatedUser = await user.save();

      console.log('Profile updated successfully:', updatedUser._id);

      res.json({
        _id: updatedUser._id,
        username: updatedUser.username,
        email: updatedUser.email,
        bio: updatedUser.bio,
        age: updatedUser.age,
        gender: updatedUser.gender,
        country: updatedUser.country,
        interests: updatedUser.interests,
        profilePicture: updatedUser.profilePicture,
        lookingFor: updatedUser.lookingFor,
        relationshipStatus: updatedUser.relationshipStatus,
        occupation: updatedUser.occupation,
        education: updatedUser.education
      });
    }
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Search users
// @route   GET /api/users/search
// @access  Private
exports.searchUsers = async (req, res) => {
  try {
    const { query, age, gender, country } = req.query;
    
    let searchQuery = {
      _id: { $ne: req.user._id },
      isBanned: false,
      blockedUsers: { $nin: [req.user._id] }
    };

    if (query) {
      searchQuery.$or = [
        { username: { $regex: query, $options: 'i' } },
        { bio: { $regex: query, $options: 'i' } }
      ];
    }

    if (age) {
      const [minAge, maxAge] = age.split('-').map(Number);
      searchQuery.age = { $gte: minAge, $lte: maxAge };
    }

    if (gender) {
      searchQuery.gender = gender;
    }

    if (country) {
      searchQuery.country = country;
    }

    const users = await User.find(searchQuery)
      .select('-password -blockedUsers')
      .limit(20);

    res.json(users);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get recommended matches
// @route   GET /api/users/recommendations
// @access  Private
exports.getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    
    // Get existing matches
    const existingMatches = await Match.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    });

    const matchedUserIds = existingMatches.map(match => 
      match.user1.toString() === req.user._id.toString() ? match.user2 : match.user1
    );

    // Find similar users based on interests, age, country
    const recommendations = await User.find({
      _id: { $nin: [...matchedUserIds, req.user._id] },
      isBanned: false,
      blockedUsers: { $nin: [req.user._id] },
      $or: [
        { interests: { $in: currentUser.interests } },
        { country: currentUser.country },
        { age: { $gte: currentUser.age - 5, $lte: currentUser.age + 5 } }
      ]
    })
    .select('-password -blockedUsers')
    .limit(10);

    res.json(recommendations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Block user
// @route   POST /api/users/block/:id
// @access  Private
exports.blockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    
    if (!user.blockedUsers.includes(req.params.id)) {
      user.blockedUsers.push(req.params.id);
      await user.save();
    }

    res.json({ message: 'User blocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Unblock user
// @route   DELETE /api/users/block/:id
// @access  Private
exports.unblockUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    user.blockedUsers = user.blockedUsers.filter(id => id.toString() !== req.params.id);
    await user.save();

    res.json({ message: 'User unblocked successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
