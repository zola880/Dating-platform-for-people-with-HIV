const Story = require('../models/Story.js');
const Notification =require('../models/Notification.js') ;

// @desc    Create story
// @route   POST /api/stories
// @access  Private
exports.createStory = async (req, res) => {
  try {
    const { media, mediaType, caption } = req.body;

    const story = await Story.create({
      user: req.user._id,
      media,
      mediaType,
      caption
    });

    const populatedStory = await Story.findById(story._id)
      .populate('user', 'username profilePicture');

    res.status(201).json(populatedStory);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all active stories
// @route   GET /api/stories
// @access  Private
exports.getStories = async (req, res) => {
  try {
    const stories = await Story.find({
      expiresAt: { $gt: new Date() }
    })
    .populate('user', 'username profilePicture')
    .populate('views.user', 'username profilePicture')
    .sort({ createdAt: -1 });

    res.json(stories);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    View story
// @route   PUT /api/stories/:id/view
// @access  Private
exports.viewStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    // Check if user already viewed
    const alreadyViewed = story.views.some(
      view => view.user.toString() === req.user._id.toString()
    );

    if (!alreadyViewed) {
      story.views.push({ user: req.user._id });
      await story.save();

      // Notify story owner
      if (story.user.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: story.user,
          type: 'system',
          content: `${req.user.username} viewed your story`,
          relatedUser: req.user._id
        });
      }
    }

    res.json(story);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete story
// @route   DELETE /api/stories/:id
// @access  Private
exports.deleteStory = async (req, res) => {
  try {
    const story = await Story.findById(req.params.id);

    if (!story) {
      return res.status(404).json({ message: 'Story not found' });
    }

    if (story.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await story.deleteOne();
    res.json({ message: 'Story deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
