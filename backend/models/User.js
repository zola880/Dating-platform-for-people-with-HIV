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
      select: false, // Don't return password by default in queries
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
      default: 'default-avatar.png', // Default profile picture filename
    },
  },
  {
    timestamps: true, // Automatically adds createdAt and updatedAt fields
  }
);

/**
 * Encrypt password using bcrypt before saving
 * This middleware runs every time a user is saved
 */
userSchema.pre('save', async function (next) {
  // Only hash the password if it has been modified (or is new)
  if (!this.isModified('password')) {
    return next();
  }

  try {
    // Generate salt and hash password
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
  } catch (error) {
    next(error);
  }
});

/**
 * Method to compare entered password with hashed password in database
 * @param {string} enteredPassword - The password entered by user during login
 * @returns {boolean} - True if passwords match, false otherwise
 */
userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model('User', userSchema);