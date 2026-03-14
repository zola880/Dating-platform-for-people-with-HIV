const mongoose=require('mongoose');

const likeSchema = new mongoose.Schema({
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
  likeType: {
    type: String,
    enum: ['like', 'super-like', 'pass'],
    default: 'like'
  },
  message: {
    type: String,
    default: ''
  }
}, {
  timestamps: true
});

// Compound index to prevent duplicate likes
likeSchema.index({ fromUser: 1, toUser: 1 }, { unique: true });

const Like = mongoose.model('Like', likeSchema);

export default Like;
