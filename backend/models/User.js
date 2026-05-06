const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

/**
 * User Schema - Defines the structure for user documents in MongoDB
 * Stores all profile information for users of the platform
 */
const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please add a name'],
      trim: true,
    },
    email: {
      type: String,
      required: [true, 'Please add an email'],
      unique: true,
      lowercase: true,
      trim: true,
      match: [
        /^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/,
        'Please add a valid email',
      ],
    },
    password: {
      type: String,
      required: [true, 'Please add a password'],
      minlength: 6,
      select: false,
    },
    age: {
      type: Number,
      required: [true, 'Please add your age'],
      min: 18,
      max: 120,
    },
    gender: {
      type: String,
      required: [true, 'Please select your gender'],
      enum: ['Male', 'Female', 'Non-binary', 'Prefer not to say', 'Other'],
    },
    bio: {
      type: String,
      maxlength: 500,
      default: '',
    },
    profilePicture: {
      type: String,
      default: 'default-avatar.png',
    },

    // --- Recommendation system fields ---
    lookingFor: {
      type: [String],
      enum: ['Male', 'Female', 'Non-binary', 'Other', 'Any'],
      default: ['Any']
    },
    interests: {
      type: [String],
      default: []
    },
    location: {
      type: {
        type: String,
        enum: ['Point'],
        default: 'Point'
      },
      coordinates: { type: [Number], default: [0, 0] }
    },

    // --- Admin fields ---
    role: {
      type: String,
      enum: ['user', 'moderator', 'admin', 'superadmin'],
      default: 'user',
    },
    status: {
      type: String,
      enum: ['active', 'suspended', 'banned'],
      default: 'active',
    },
    suspendedUntil: {
      type: Date,
      default: null,
    },
    reports: [{
      reportedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
      reason: String,
      description: String,
      createdAt: { type: Date, default: Date.now },
      resolved: { type: Boolean, default: false },
    }],
  },
  {
    timestamps: true,
  }
);

/**
 * Encrypt password using bcrypt before saving
 */
userSchema.pre('save', async function (next) {
  if (!this.isModified('password')) {
    return next();
  }
  try {
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Compare entered password with hashed password
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);