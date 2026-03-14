const Message =require('../models/Message.js') ;

// @desc    Get conversation between two users
// @route   GET /api/messages/:userId
// @access  Private
exports.getConversation = async (req, res) => {
  try {
    const messages = await Message.find({
      $or: [
        { fromUser: req.user._id, toUser: req.params.userId },
        { fromUser: req.params.userId, toUser: req.user._id }
      ]
    })
    .populate('fromUser', 'username profilePicture')
    .populate('toUser', 'username profilePicture')
    .sort({ createdAt: 1 });

    // Mark messages as read
    await Message.updateMany(
      { fromUser: req.params.userId, toUser: req.user._id, read: false },
      { read: true }
    );

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all conversations
// @route   GET /api/messages
// @access  Private
exports.getConversations = async (req, res) => {
  try {
    const messages = await Message.aggregate([
      {
        $match: {
          $or: [
            { fromUser: req.user._id },
            { toUser: req.user._id }
          ]
        }
      },
      {
        $sort: { createdAt: -1 }
      },
      {
        $group: {
          _id: {
            $cond: [
              { $eq: ['$fromUser', req.user._id] },
              '$toUser',
              '$fromUser'
            ]
          },
          lastMessage: { $first: '$$ROOT' }
        }
      }
    ]);

    await Message.populate(messages, {
      path: 'lastMessage.fromUser lastMessage.toUser',
      select: 'username profilePicture isOnline'
    });

    res.json(messages);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
