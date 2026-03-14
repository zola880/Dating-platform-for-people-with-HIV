
const Group=require('../models/Group.js')
const Notification=require('../models/Notification.js');

// @desc    Create group
// @route   POST /api/groups
// @access  Private
exports.createGroup = async (req, res) => {
  try {
    const { name, description, category, isPrivate, rules } = req.body;

    const group = await Group.create({
      name,
      description,
      category,
      isPrivate,
      rules: rules || [],
      creator: req.user._id,
      members: [{
        user: req.user._id,
        role: 'admin'
      }]
    });

    const populatedGroup = await Group.findById(group._id)
      .populate('creator', 'username profilePicture')
      .populate('members.user', 'username profilePicture');

    res.status(201).json(populatedGroup);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all groups
// @route   GET /api/groups
// @access  Private
exports.getGroups = async (req, res) => {
  try {
    const { category, search } = req.query;
    
    let query = { isPrivate: false };
    
    if (category) {
      query.category = category;
    }
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ];
    }

    const groups = await Group.find(query)
      .populate('creator', 'username profilePicture')
      .populate('members.user', 'username profilePicture')
      .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single group
// @route   GET /api/groups/:id
// @access  Private
exports.getGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id)
      .populate('creator', 'username profilePicture')
      .populate('members.user', 'username profilePicture')
      .populate({
        path: 'posts',
        populate: {
          path: 'createdBy',
          select: 'username profilePicture'
        }
      });

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Join group
// @route   POST /api/groups/:id/join
// @access  Private
exports.joinGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    const isMember = group.members.some(
      member => member.user.toString() === req.user._id.toString()
    );

    if (isMember) {
      return res.status(400).json({ message: 'Already a member' });
    }

    group.members.push({
      user: req.user._id,
      role: 'member'
    });

    await group.save();

    // Notify group admins
    const admins = group.members.filter(m => m.role === 'admin');
    for (const admin of admins) {
      await Notification.create({
        user: admin.user,
        type: 'system',
        content: `${req.user.username} joined ${group.name}`,
        relatedUser: req.user._id
      });
    }

    res.json(group);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Leave group
// @route   POST /api/groups/:id/leave
// @access  Private
exports.leaveGroup = async (req, res) => {
  try {
    const group = await Group.findById(req.params.id);

    if (!group) {
      return res.status(404).json({ message: 'Group not found' });
    }

    group.members = group.members.filter(
      member => member.user.toString() !== req.user._id.toString()
    );

    await group.save();
    res.json({ message: 'Left group successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's groups
// @route   GET /api/groups/my-groups
// @access  Private
exports.getMyGroups = async (req, res) => {
  try {
    const groups = await Group.find({
      'members.user': req.user._id
    })
    .populate('creator', 'username profilePicture')
    .populate('members.user', 'username profilePicture')
    .sort({ createdAt: -1 });

    res.json(groups);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
