const HealthLog=require('../models/HealthLog.js');

const MedicationReminder=require('../models/MedicationReminder.js');

// @desc    Create health log
// @route   POST /api/health/logs
// @access  Private
exports.createHealthLog = async (req, res) => {
  try {
    const logData = {
      user: req.user._id,
      ...req.body
    };

    const healthLog = await HealthLog.create(logData);
    res.status(201).json(healthLog);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's health logs
// @route   GET /api/health/logs
// @access  Private
exports.getHealthLogs = async (req, res) => {
  try {
    const { logType, startDate, endDate } = req.query;
    
    let query = { user: req.user._id };
    
    if (logType) {
      query.logType = logType;
    }
    
    if (startDate && endDate) {
      query.createdAt = {
        $gte: new Date(startDate),
        $lte: new Date(endDate)
      };
    }

    const logs = await HealthLog.find(query).sort({ createdAt: -1 });
    res.json(logs);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Create medication reminder
// @route   POST /api/health/reminders
// @access  Private
exports.createReminder = async (req, res) => {
  try {
    const {
      medicationName, dosage, frequency, reminderTimes, startDate, endDate, notes
    } = req.body;

    const reminder = await MedicationReminder.create({
      user: req.user._id,
      medicationName,
      dosage,
      frequency,
      reminderTimes,
      startDate,
      endDate,
      notes
    });

    res.status(201).json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's medication reminders
// @route   GET /api/health/reminders
// @access  Private
exports.getReminders = async (req, res) => {
  try {
    const reminders = await MedicationReminder.find({
      user: req.user._id,
      isActive: true
    }).sort({ createdAt: -1 });

    res.json(reminders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Log medication taken
// @route   POST /api/health/reminders/:id/log
// @access  Private
exports.logMedicationTaken = async (req, res) => {
  try {
    const { taken, time } = req.body;
    const reminder = await MedicationReminder.findById(req.params.id);

    if (!reminder) {
      return res.status(404).json({ message: 'Reminder not found' });
    }

    if (reminder.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: 'Not authorized' });
    }

    reminder.takenLog.push({
      date: new Date(),
      taken,
      time
    });

    await reminder.save();
    res.json(reminder);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get health statistics
// @route   GET /api/health/stats
// @access  Private
exports.getHealthStats = async (req, res) => {
  try {
    const logs = await HealthLog.find({ user: req.user._id });
    
    const stats = {
      totalLogs: logs.length,
      byType: {},
      recentMood: [],
      medicationAdherence: 0
    };

    // Count by type
    logs.forEach(log => {
      stats.byType[log.logType] = (stats.byType[log.logType] || 0) + 1;
    });

    // Recent mood tracking
    const moodLogs = logs
      .filter(log => log.logType === 'mood')
      .slice(0, 7)
      .reverse();
    stats.recentMood = moodLogs.map(log => ({
      date: log.createdAt,
      mood: log.mood
    }));

    // Medication adherence
    const reminders = await MedicationReminder.find({
      user: req.user._id,
      isActive: true
    });

    let totalDoses = 0;
    let takenDoses = 0;

    reminders.forEach(reminder => {
      totalDoses += reminder.takenLog.length;
      takenDoses += reminder.takenLog.filter(log => log.taken).length;
    });

    stats.medicationAdherence = totalDoses > 0 
      ? Math.round((takenDoses / totalDoses) * 100) 
      : 0;

    res.json(stats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
