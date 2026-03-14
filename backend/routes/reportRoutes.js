import express from 'express';
const {
  createReport,
  getReports,
  updateReport
} = '../controllers/reportController.js';
const { protect, admin } = '../middleware/auth.js';

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, admin, getReports);
router.put('/:id', protect, admin, updateReport);

export default router;
