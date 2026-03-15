const mongoose=require('mongoose');

const datingPreferenceSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    unique: true
  },
  lookingFor: {
    type: String,
    enum: ['serious-relationship', 'casual-dating', 'friendship', 'open-to-anything'],
    default: 'open-to-anything'
  },
  interestedIn: [{
    type: String,
    enum: ['male', 'female', 'non-binary', 'everyone']
  }],
  ageRange: {
    min: {
      type: Number,
      default: 18
    },
    max: {
      type: Number,
      default: 99
    }
  },
  maxDistance: {
    type: Number, // in kilometers
    default: 100
  },
  dealBreakers: [{
    type: String
  }],
  mustHaves: [{
    type: String
  }],
  dateIdeas: [{
    type: String
  }],
  relationshipGoals: {
    type: String
  },
  hasChildren: {
    type: Boolean,
    default: false
  },
  wantsChildren: {
    type: String,
    enum: ['yes', 'no', 'maybe', 'have-and-want-more']
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
  }]
}, {
  timestamps: true
});

const DatingPreference = mongoose.model('DatingPreference', datingPreferenceSchema);

module.exports = DatingPreference;
