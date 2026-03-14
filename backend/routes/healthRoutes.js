import express from 'express';
const {
  createHealthLog,
  getHealthLogs,
  createReminder,
  getReminders,
  logMedicationTaken,
  getHealthStats
} = '../controllers/healthController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.route('/logs')
  .get(protect, getHealthLogs)
  .post(protect, createHealthLog);

router.route('/reminders')
  .get(protect, getReminders)
  .post(protect, createReminder);

router.post('/reminders/:id/log', protect, logMedicationTaken);
router.get('/stats', protect, getHealthStats);

export default router;
