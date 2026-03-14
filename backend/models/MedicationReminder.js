const mongoose=require('mongoose');

const medicationReminderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  medicationName: {
    type: String,
    required: true
  },
  dosage: {
    type: String,
    required: true
  },
  frequency: {
    type: String,
    enum: ['once-daily', 'twice-daily', 'three-times-daily', 'as-needed', 'custom'],
    required: true
  },
  reminderTimes: [{
    type: String // Format: "HH:MM"
  }],
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date
  },
  isActive: {
    type: Boolean,
    default: true
  },
  notes: {
    type: String
  },
  takenLog: [{
    date: Date,
    taken: Boolean,
    time: String
  }]
}, {
  timestamps: true
});

const MedicationReminder = mongoose.model('MedicationReminder', medicationReminderSchema);

export default MedicationReminder;
