const Post = require('../models/Post');
const fs = require('fs');
const path = require('path');

/**
 * @desc    Create a new post (supports images and videos)
 * @route   POST /api/posts
 * @access  Private
 */
const createPost = async (req, res) => {
  try {
    console.log('Create post request received');
    console.log('Body:', req.body);
    console.log('File:', req.file);

    const { content } = req.body;

    if (!content && !req.file) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(400).json({ message: 'Post content or media is required' });
    }

    let media = null;
    let mediaType = 'none';

    if (req.file) {
      media = req.file.filename;
      mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    const post = await Post.create({
      user: req.user._id,
      content: content || '',
      image: media,
      media: media,
      mediaType: mediaType,
    });

    const populatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.status(201).json(populatedPost);
  } catch (error) {
    console.error('Create post error:', error);
    if (req.file) {
      fs.unlink(req.file.path, (err) => {
        if (err) console.error('Error deleting file:', err);
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};


/**
 * @desc    Get all posts (feed)
 * @route   GET /api/posts
 * @access  Private
 */
const getAllPosts = async (req, res) => {
  try {
    const posts = await Post.find()
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture')
      .sort({ createdAt: -1 }); // newest first

    res.json(posts);
  } catch (error) {
    console.error('Get all posts error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Get a single post
 * @route   GET /api/posts/:id
 * @access  Private
 */
const getPostById = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.json(post);
  } catch (error) {
    console.error('Get post by id error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'Post not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Update a post
 * @route   PUT /api/posts/:id
 * @access  Private
 */
const updatePost = async (req, res) => {
  try {
    let post = await Post.findById(req.params.id);
    if (!post) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      if (req.file) fs.unlinkSync(req.file.path);
      return res.status(403).json({ message: 'Not authorized to update this post' });
    }

    // Update text content
    if (req.body.content !== undefined) post.content = req.body.content;

    // Handle media update
    if (req.file) {
      // Delete old media if exists
      if (post.media) {
        const oldMediaPath = path.join(__dirname, '../uploads', post.media);
        if (fs.existsSync(oldMediaPath)) fs.unlinkSync(oldMediaPath);
      }
      post.media = req.file.filename;
      post.image = req.file.filename; // For backward compatibility
      post.mediaType = req.file.mimetype.startsWith('image/') ? 'image' : 'video';
    }

    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Update post error:', error);
    if (req.file) fs.unlinkSync(req.file.path);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a post
 * @route   DELETE /api/posts/:id
 * @access  Private
 */
const deletePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check ownership
    if (post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this post' });
    }

    // Delete associated media if exists
    if (post.media) {
      const mediaPath = path.join(__dirname, '../uploads', post.media);
      if (fs.existsSync(mediaPath)) fs.unlinkSync(mediaPath);
    }

    await post.deleteOne();
    res.json({ message: 'Post deleted successfully' });
  } catch (error) {
    console.error('Delete post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Like a post
 * @route   PUT /api/posts/:id/like
 * @access  Private
 */
const likePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if already liked
    if (post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post already liked' });
    }

    post.likes.push(req.user._id);
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Like post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Unlike a post
 * @route   PUT /api/posts/:id/unlike
 * @access  Private
 */
const unlikePost = async (req, res) => {
  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    // Check if liked
    if (!post.likes.includes(req.user._id)) {
      return res.status(400).json({ message: 'Post not liked yet' });
    }

    post.likes = post.likes.filter(
      (like) => like.toString() !== req.user._id.toString()
    );
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Unlike post error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Add comment to a post
 * @route   POST /api/posts/:id/comments
 * @access  Private
 */
const addComment = async (req, res) => {
  try {
    const { text } = req.body;
    if (!text) {
      return res.status(400).json({ message: 'Comment text is required' });
    }

    const post = await Post.findById(req.params.id);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    post.comments.push({
      user: req.user._id,
      text,
    });
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Add comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

/**
 * @desc    Delete a comment
 * @route   DELETE /api/posts/:postId/comments/:commentId
 * @access  Private
 */
const deleteComment = async (req, res) => {
  try {
    const post = await Post.findById(req.params.postId);
    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    const comment = post.comments.id(req.params.commentId);
    if (!comment) {
      return res.status(404).json({ message: 'Comment not found' });
    }

    // Check if user is comment author or post owner
    if (comment.user.toString() !== req.user._id.toString() &&
        post.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized to delete this comment' });
    }

    comment.deleteOne();
    await post.save();

    const updatedPost = await Post.findById(post._id)
      .populate('user', 'name profilePicture')
      .populate('likes', 'name profilePicture')
      .populate('comments.user', 'name profilePicture');

    res.json(updatedPost);
  } catch (error) {
    console.error('Delete comment error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = {
  createPost,
  getAllPosts,
  getPostById,
  updatePost,
  deletePost,
  likePost,
  unlikePost,
  addComment,
  deleteComment,
};