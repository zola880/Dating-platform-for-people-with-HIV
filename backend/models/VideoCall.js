const mongoose=require('mongoose');

const videoCallSchema = new mongoose.Schema({
  caller: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  receiver: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  roomId: {
    type: String,
    required: true,
    unique: true
  },
  status: {
    type: String,
    enum: ['initiated', 'ringing', 'ongoing', 'ended', 'missed', 'rejected'],
    default: 'initiated'
  },
  startTime: {
    type: Date,
    default: Date.now
  },
  endTime: {
    type: Date
  },
  duration: {
    type: Number, // in seconds
    default: 0
  },
  callType: {
    type: String,
    enum: ['video', 'audio'],
    default: 'video'
  }
}, {
  timestamps: true
});

const VideoCall = mongoose.model('VideoCall', videoCallSchema);

export default VideoCall;
