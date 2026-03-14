const User=require('../models/User.js');
const DatingPreference=require('../models/DatingPreference.js');
const Like=require('../models/Like.js');
const Match=require('../models/Match.js');
const Notification=require('../models/Notification.js');

// @desc    Get/Create dating preferences
// @route   GET/POST /api/dating/preferences
// @access  Private
exports.getDatingPreferences = async (req, res) => {
  try {
    let preferences = await DatingPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      preferences = await DatingPreference.create({
        user: req.user._id,
        interestedIn: ['everyone']
      });
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

exports.updateDatingPreferences = async (req, res) => {
  try {
    let preferences = await DatingPreference.findOne({ user: req.user._id });
    
    if (!preferences) {
      preferences = await DatingPreference.create({
        user: req.user._id,
        ...req.body
      });
    } else {
      Object.assign(preferences, req.body);
      await preferences.save();
    }
    
    res.json(preferences);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get dating matches (swipe-style)
// @route   GET /api/dating/discover
// @access  Private
exports.getDiscoverProfiles = async (req, res) => {
  try {
    const preferences = await DatingPreference.findOne({ user: req.user._id });
    const currentUser = await User.findById(req.user._id);
    
    // Get users already liked or passed
    const interactions = await Like.find({ fromUser: req.user._id });
    const interactedUserIds = interactions.map(i => i.toUser);
    
    // Get existing matches
    const matches = await Match.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ]
    });
    const matchedUserIds = matches.map(m => 
      m.user1.toString() === req.user._id.toString() ? m.user2 : m.user1
    );

    // Build query
    let query = {
      _id: { $nin: [...interactedUserIds, ...matchedUserIds, req.user._id] },
      isBanned: false,
      blockedUsers: { $nin: [req.user._id] }
    };

    // Apply preferences
    if (preferences) {
      if (preferences.interestedIn && preferences.interestedIn.length > 0 && !preferences.interestedIn.includes('everyone')) {
        query.gender = { $in: preferences.interestedIn };
      }
      
      if (preferences.ageRange) {
        query.age = {
          $gte: preferences.ageRange.min,
          $lte: preferences.ageRange.max
        };
      }
    }

    const profiles = await User.find(query)
      .select('-password -blockedUsers')
      .limit(20);

    res.json(profiles);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like a user
// @route   POST /api/dating/like/:userId
// @access  Private
exports.likeUser = async (req, res) => {
  try {
    const { likeType, message } = req.body;
    const toUserId = req.params.userId;

    // Check if already liked
    const existingLike = await Like.findOne({
      fromUser: req.user._id,
      toUser: toUserId
    });

    if (existingLike) {
      return res.status(400).json({ message: 'Already interacted with this user' });
    }

    // Create like
    const like = await Like.create({
      fromUser: req.user._id,
      toUser: toUserId,
      likeType,
      message: message || ''
    });

    // Check if it's a mutual like (match)
    const reciprocalLike = await Like.findOne({
      fromUser: toUserId,
      toUser: req.user._id,
      likeType: { $in: ['like', 'super-like'] }
    });

    let isMatch = false;

    if (reciprocalLike && likeType !== 'pass') {
      // Create match
      const match = await Match.create({
        user1: req.user._id,
        user2: toUserId,
        status: 'accepted'
      });

      isMatch = true;

      // Notify both users
      await Notification.create({
        user: toUserId,
        type: 'match',
        content: `It's a match! ${req.user.username} likes you too!`,
        relatedUser: req.user._id
      });

      await Notification.create({
        user: req.user._id,
        type: 'match',
        content: `It's a match! You and ${reciprocalLike.fromUser.username} liked each other!`,
        relatedUser: toUserId
      });
    } else if (likeType !== 'pass') {
      // Just notify the liked user
      await Notification.create({
        user: toUserId,
        type: 'match',
        content: `${req.user.username} ${likeType === 'super-like' ? 'super ' : ''}liked you!`,
        relatedUser: req.user._id
      });
    }

    res.json({ 
      success: true, 
      isMatch,
      message: isMatch ? "It's a match!" : 'Like sent!'
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get users who liked me
// @route   GET /api/dating/likes-received
// @access  Private
exports.getLikesReceived = async (req, res) => {
  try {
    const likes = await Like.find({
      toUser: req.user._id,
      likeType: { $in: ['like', 'super-like'] }
    })
    .populate('fromUser', 'username profilePicture age gender country bio interests')
    .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get my likes
// @route   GET /api/dating/my-likes
// @access  Private
exports.getMyLikes = async (req, res) => {
  try {
    const likes = await Like.find({
      fromUser: req.user._id,
      likeType: { $in: ['like', 'super-like'] }
    })
    .populate('toUser', 'username profilePicture age gender country bio interests')
    .sort({ createdAt: -1 });

    res.json(likes);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get enhanced match recommendations
// @route   GET /api/dating/recommendations
// @access  Private
exports.getEnhancedRecommendations = async (req, res) => {
  try {
    const preferences = await DatingPreference.findOne({ user: req.user._id });
    const currentUser = await User.findById(req.user._id);
    
    // Get existing matches and interactions
    const interactions = await Like.find({ fromUser: req.user._id });
    const interactedUserIds = interactions.map(i => i.toUser);
    
    const matches = await Match.find({
      $or: [{ user1: req.user._id }, { user2: req.user._id }]
    });
    const matchedUserIds = matches.map(m => 
      m.user1.toString() === req.user._id.toString() ? m.user2 : m.user1
    );

    // Build scoring query
    let query = {
      _id: { $nin: [...interactedUserIds, ...matchedUserIds, req.user._id] },
      isBanned: false,
      blockedUsers: { $nin: [req.user._id] }
    };

    // Apply preferences
    if (preferences) {
      if (preferences.interestedIn && preferences.interestedIn.length > 0 && !preferences.interestedIn.includes('everyone')) {
        query.gender = { $in: preferences.interestedIn };
      }
      
      if (preferences.ageRange) {
        query.age = {
          $gte: preferences.ageRange.min,
          $lte: preferences.ageRange.max
        };
      }
    }

    const users = await User.find(query)
      .select('-password -blockedUsers')
      .limit(50);

    // Score users based on compatibility
    const scoredUsers = users.map(user => {
      let score = 0;
      
      // Shared interests
      const sharedInterests = currentUser.interests.filter(i => 
        user.interests.includes(i)
      );
      score += sharedInterests.length * 10;
      
      // Same country
      if (user.country === currentUser.country) {
        score += 20;
      }
      
      // Age proximity
      const ageDiff = Math.abs(user.age - currentUser.age);
      if (ageDiff <= 5) score += 15;
      else if (ageDiff <= 10) score += 10;
      else if (ageDiff <= 15) score += 5;
      
      return { ...user.toObject(), compatibilityScore: score };
    });

    // Sort by score
    scoredUsers.sort((a, b) => b.compatibilityScore - a.compatibilityScore);

    res.json(scoredUsers.slice(0, 20));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
