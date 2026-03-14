
const Match=require('../models/Match.js');
const Notification=require('../models/Notification.js');

// @desc    Send match request
// @route   POST /api/matches/:userId
// @access  Private
exports.sendMatchRequest = async (req, res) => {
  try {
    const { userId } = req.params;

    if (userId === req.user._id.toString()) {
      return res.status(400).json({ message: 'Cannot match with yourself' });
    }

    const existingMatch = await Match.findOne({
      $or: [
        { user1: req.user._id, user2: userId },
        { user1: userId, user2: req.user._id }
      ]
    });

    if (existingMatch) {
      return res.status(400).json({ message: 'Match request already exists' });
    }

    const match = await Match.create({
      user1: req.user._id,
      user2: userId,
      status: 'pending'
    });

    // Create notification
    await Notification.create({
      user: userId,
      type: 'match',
      content: `${req.user.username} sent you a match request`,
      relatedUser: req.user._id
    });

    res.status(201).json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Respond to match request
// @route   PUT /api/matches/:matchId
// @access  Private
exports.respondToMatch = async (req, res) => {
  try {
    const { status } = req.body;
    const match = await Match.findById(req.params.matchId);

    if (!match) {
      return res.status(404).json({ message: 'Match not found' });
    }

    if (match.user2.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    match.status = status;
    await match.save();

    // Create notification
    await Notification.create({
      user: match.user1,
      type: 'match',
      content: status === 'accepted' 
        ? `${req.user.username} accepted your match request!`
        : `${req.user.username} declined your match request`,
      relatedUser: req.user._id
    });

    res.json(match);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user matches
// @route   GET /api/matches
// @access  Private
exports.getMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      $or: [
        { user1: req.user._id },
        { user2: req.user._id }
      ],
      status: 'accepted'
    })
    .populate('user1', 'username profilePicture age country')
    .populate('user2', 'username profilePicture age country')
    .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get pending match requests
// @route   GET /api/matches/pending
// @access  Private
exports.getPendingMatches = async (req, res) => {
  try {
    const matches = await Match.find({
      user2: req.user._id,
      status: 'pending'
    })
    .populate('user1', 'username profilePicture age country bio')
    .sort({ createdAt: -1 });

    res.json(matches);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
