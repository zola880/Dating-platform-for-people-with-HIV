import mongoose from 'mongoose';

const messageSchema = new mongoose.Schema({
  fromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  toUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  text: {
    type: String,
    required: true
  },
  read: {
    type: Boolean,
    default: false
  },
  isModerated: {
    type: Boolean,
    default: false
  },
  moderationFlag: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

const Message = mongoose.model('Message', messageSchema);

export default Message;
