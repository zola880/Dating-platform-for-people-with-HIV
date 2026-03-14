const  Post =require( '../models/Post.js');
const Notification =require('../models/Notification.js') ;
const { moderateContent }=require('../utils/aiModeration.js');

// @desc    Create new post
// @route   POST /api/posts
// @access  Private
exports.createPost = async (req, res) => {
  try {
    const { text, images } = req.body;
    
    // AI moderation
    const moderation = await moderateContent(text);
    
    const post = await Post.create({
      text,
      images: images || [],
      createdBy: req.user._id,
      isModerated: moderation.isOffensive,
      moderationFlag: moderation.flag
    });

    const populatedPost = await Post.findById(post._id)
      .populate('createdBy', 'username profilePicture');

    console.log('Post created:', post._id);

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Post creation error:', error);
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all posts (feed)
// @route   GET /api/posts
// @access  Private
exports.getPosts = async (req, res) => {
  try {
    const posts = await Post.find({ isModerated: false })
      .populate('createdBy', 'username profilePicture')
      .populate('comments.user', 'username profilePicture')
      .sort({ createdAt: -1 })
      .limit(50);

    res.json(posts);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single post
// @route   GET /api/posts/:id
// @access  Private
exports.getPost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('createdBy', 'username profilePicture')
      .populate('comments.user', 'username profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Like/Unlike post
// @route   PUT /api/posts/:id/like
// @access  Private
exports.likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const alreadyLiked = post.likes.includes(req.user._id);

    if (alreadyLiked) {
      post.likes = post.likes.filter(id => id.toString() !== req.user._id.toString());
    } else {
      post.likes.push(req.user._id);
      
      // Create notification
      if (post.createdBy.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: post.createdBy,
          type: 'like',
          content: `${req.user.username} liked your post`,
          relatedUser: req.user._id,
          relatedPost: post._id
        });
      }
    }

    await post.save();
    res.json(post);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Comment on post
// @route   POST /api/posts/:id/comment
// @access  Private
exports.commentOnPost = async (req, res) => {
  try {
    const { text } = req.body;
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const moderation = await moderateContent(text);
    
    if (!moderation.isOffensive) {
      post.comments.push({
        user: req.user._id,
        text
      });

      await post.save();

      // Create notification
      if (post.createdBy.toString() !== req.user._id.toString()) {
        await Notification.create({
          user: post.createdBy,
          type: 'comment',
          content: `${req.user.username} commented on your post`,
          relatedUser: req.user._id,
          relatedPost: post._id
        });
      }

      const updatedPost = await Post.findById(post._id)
        .populate('createdBy', 'username profilePicture')
        .populate('comments.user', 'username profilePicture');

      res.json(updatedPost);
    } else {
      res.status(400).json({ message: 'Comment flagged for moderation', flag: moderation.flag });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Delete post
// @route   DELETE /api/posts/:id
// @access  Private
exports.deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    if (post.createdBy.toString() !== req.user._id.toString() && !req.user.isAdmin) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
