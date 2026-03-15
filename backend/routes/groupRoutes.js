const express = require('express');
const {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  getMyGroups
} = require('../controllers/groupController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
  .get(protect, getGroups)
  .post(protect, createGroup);

router.get('/my-groups', protect, getMyGroups);

router.route('/:id')
  .get(protect, getGroup);

router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);

module.exports = router;
