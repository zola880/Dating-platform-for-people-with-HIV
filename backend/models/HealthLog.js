const mongoose=require('mongoose');

const healthLogSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  logType: {
    type: String,
    enum: ['medication', 'appointment', 'symptom', 'lab-result', 'mood', 'exercise', 'diet'],
    required: true
  },
  // Medication tracking
  medicationName: String,
  dosage: String,
  timeTaken: Date,
  
  // Appointment tracking
  appointmentType: String,
  appointmentDate: Date,
  doctor: String,
  notes: String,
  
  // Symptom tracking
  symptomName: String,
  severity: {
    type: Number,
    min: 1,
    max: 10
  },
  
  // Lab results
  testName: String,
  result: String,
  resultDate: Date,
  
  // Mood tracking
  mood: {
    type: String,
    enum: ['excellent', 'good', 'okay', 'bad', 'terrible']
  },
  
  // Exercise tracking
  exerciseType: String,
  duration: Number, // in minutes
  
  // Diet tracking
  mealType: {
    type: String,
    enum: ['breakfast', 'lunch', 'dinner', 'snack']
  },
  calories: Number,
  
  // Common fields
  description: String,
  isPrivate: {
    type: Boolean,
    default: true
  }
}, {
  timestamps: true
});

const HealthLog = mongoose.model('HealthLog', healthLogSchema);

module.exports = HealthLog;
