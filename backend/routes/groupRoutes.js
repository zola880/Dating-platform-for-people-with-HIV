import express from 'express';
const {
  createGroup,
  getGroups,
  getGroup,
  joinGroup,
  leaveGroup,
  getMyGroups
} = '../controllers/groupController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getGroups)
  .post(protect, createGroup);

router.get('/my-groups', protect, getMyGroups);

router.route('/:id')
  .get(protect, getGroup);

router.post('/:id/join', protect, joinGroup);
router.post('/:id/leave', protect, leaveGroup);

export default router;
