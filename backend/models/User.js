const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const userSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
    trim: true
  },
  email: {
    type: String,
    required: true,
    unique: true,
    lowercase: true
  },
  password: {
    type: String,
    required: true
  },
  age: {
    type: Number,
    required: true
  },
  gender: {
    type: String,
    enum: ['male', 'female', 'non-binary', 'other', 'prefer-not-to-say'],
    required: true
  },
  country: {
    type: String,
    required: true
  },
  bio: {
    type: String,
    default: ''
  },
  profilePicture: {
    type: String,
    default: ''
  },
  photos: [{
    type: String
  }],
  interests: [{
    type: String
  }],
  lookingFor: {
    type: String,
    enum: ['serious-relationship', 'casual-dating', 'friendship', 'marriage', 'open-to-anything'],
    default: 'open-to-anything'
  },
  relationshipStatus: {
    type: String,
    enum: ['single', 'divorced', 'widowed', 'its-complicated'],
    default: 'single'
  },
  height: {
    type: Number // in cm
  },
  bodyType: {
    type: String,
    enum: ['slim', 'athletic', 'average', 'curvy', 'heavyset', 'prefer-not-to-say']
  },
  ethnicity: {
    type: String
  },
  religion: {
    type: String
  },
  hasChildren: {
    type: Boolean,
    default: false
  },
  wantsChildren: {
    type: String,
    enum: ['yes', 'no', 'maybe', 'have-and-want-more', 'prefer-not-to-say']
  },
  smoking: {
    type: String,
    enum: ['yes', 'no', 'occasionally', 'prefer-not-to-say']
  },
  drinking: {
    type: String,
    enum: ['yes', 'no', 'socially', 'prefer-not-to-say']
  },
  education: {
    type: String
  },
  occupation: {
    type: String
  },
  languages: [{
    type: String
  }],
  hivStatusVisibility: {
    type: String,
    enum: ['public', 'matches-only', 'private'],
    default: 'matches-only'
  },
  isOnline: {
    type: Boolean,
    default: false
  },
  lastLogin: {
    type: Date,
    default: Date.now
  },
  blockedUsers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  }],
  isAnonymous: {
    type: Boolean,
    default: false
  },
  isBanned: {
    type: Boolean,
    default: false
  },
  isAdmin: {
    type: Boolean,
    default: false
  }
}, {
  timestamps: true
});

// Hash password before saving
userSchema.pre('save', async function(next) {
  if (!this.isModified('password')) {
    next();
  }
  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);
});

// Compare password
userSchema.methods.matchPassword = async function(enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);

module.exports = User;
// i updated the user model to include more fields and options for a dating app. I also added password hashing and comparison methods for security.