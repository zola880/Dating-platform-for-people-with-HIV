const Message = require('../models/Message');
const User = require('../models/User');
const fs = require('fs');
const path = require('path');

const sendMessage = async (req, res) => {
  try {
    const { receiverId, content } = req.body;
    const senderId = req.user._id;

    if (!receiverId) {
      return res.status(400).json({ message: 'Receiver ID is required' });
    }

    const receiver = await User.findById(receiverId);
    if (!receiver) {
      return res.status(404).json({ message: 'Receiver not found' });
    }

    if (senderId.toString() === receiverId) {
      return res.status(400).json({ message: 'You cannot send a message to yourself' });
    }

    // Process attachments
    let attachments = [];
    if (req.files && req.files.length) {
      attachments = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        fileType: file.mimetype.startsWith('image/') ? 'image' : 'file',
        size: file.size,
      }));
    }

    const message = await Message.create({
      sender: senderId,
      receiver: receiverId,
      content: content ? content.trim() : '',
      attachments,
    });

    const populatedMessage = await Message.findById(message._id)
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture');

    res.status(201).json(populatedMessage);
  } catch (error) {
    console.error('Send message error:', error);
    // If files were uploaded but error occurs, clean them up
    if (req.files && req.files.length) {
      req.files.forEach(file => {
        fs.unlink(file.path, (err) => {
          if (err) console.error('Error deleting file:', err);
        });
      });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getMessages = async (req, res) => {
  try {
    const otherUserId = req.params.userId;
    const currentUserId = req.user._id;

    const otherUser = await User.findById(otherUserId);
    if (!otherUser) {
      return res.status(404).json({ message: 'User not found' });
    }

    const messages = await Message.find({
      $or: [
        { sender: currentUserId, receiver: otherUserId },
        { sender: otherUserId, receiver: currentUserId },
      ],
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: 1 });

    res.json(messages);
  } catch (error) {
    console.error('Get messages error:', error);
    if (error.kind === 'ObjectId') {
      return res.status(404).json({ message: 'User not found' });
    }
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

const getConversations = async (req, res) => {
  try {
    const currentUserId = req.user._id;

    const messages = await Message.find({
      $or: [{ sender: currentUserId }, { receiver: currentUserId }],
    })
      .populate('sender', 'name profilePicture')
      .populate('receiver', 'name profilePicture')
      .sort({ createdAt: -1 });

    const conversations = new Map();

    messages.forEach(message => {
      const otherUser = message.sender._id.toString() === currentUserId.toString()
        ? message.receiver
        : message.sender;

      const conversationId = otherUser._id.toString();

      if (!conversations.has(conversationId)) {
        conversations.set(conversationId, {
          user: otherUser,
          lastMessage: message.content,
          lastMessageTime: message.createdAt,
          unreadCount: message.receiver._id.toString() === currentUserId.toString() && !message.read ? 1 : 0,
        });
      } else {
        const existing = conversations.get(conversationId);
        if (message.receiver._id.toString() === currentUserId.toString() && !message.read) {
          existing.unreadCount += 1;
        }
        conversations.set(conversationId, existing);
      }
    });

    const conversationList = Array.from(conversations.values())
      .sort((a, b) => new Date(b.lastMessageTime) - new Date(a.lastMessageTime));

    res.json(conversationList);
  } catch (error) {
    console.error('Get conversations error:', error);
    res.status(500).json({ message: 'Server error', error: error.message });
  }
};

module.exports = { sendMessage, getMessages, getConversations };