const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['user', 'post', 'comment', 'message'],
    required: true,
  },
  targetUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  targetPost: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Post',
  },
  targetComment: {
    type: String,
  },
  targetMessage: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Message',
  },
  reportedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  reason: {
    type: String,
    required: true,
  },
  description: {
    type: String,
  },
  resolved: {
    type: Boolean,
    default: false,
  },
  resolvedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
  },
  resolvedAt: {
    type: Date,
  },
  actionTaken: {
    type: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);