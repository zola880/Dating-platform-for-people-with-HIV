const User = require('../models/User');
const { compatibilityScore } = require('../utils/recommendation');

exports.getRecommendations = async (req, res) => {
  try {
    const currentUser = await User.findById(req.user._id);
    let candidatesQuery = {
      _id: { $ne: currentUser._id },
      status: 'active'
    };

    // Strict opposite‑gender rule
    if (currentUser.gender === 'Male') {
      candidatesQuery.gender = 'Female';
    } else if (currentUser.gender === 'Female') {
      candidatesQuery.gender = 'Male';
    }
    // For Non‑binary, we keep all genders (no filter)

    const candidates = await User.find(candidatesQuery).select('-password');

    const scored = candidates.map(user => ({
      user,
      score: compatibilityScore(currentUser, user)
    }));

    const recommendations = scored
      .sort((a, b) => b.score - a.score)
      .slice(0, 10)
      .map(item => item.user);

    res.json(recommendations);
  } catch (error) {
    console.error('Recommendation error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};