const express = require('express');
const {
  createReport,
  getReports,
  updateReport
} = require('../controllers/reportController.js');
const { protect, admin } = require('../middleware/auth.js');

const router = express.Router();

router.post('/', protect, createReport);
router.get('/', protect, admin, getReports);
router.put('/:id', protect, admin, updateReport);

module.exports = router;
