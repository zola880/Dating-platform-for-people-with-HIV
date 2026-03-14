import express from 'express';
const {
  createEvent,
  getEvents,
  getEvent,
  rsvpEvent,
  getMyEvents
} = '../controllers/eventController.js';
const { protect } = '../middleware/auth.js';

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.get('/my-events', protect, getMyEvents);

router.route('/:id')
  .get(protect, getEvent);

router.post('/:id/rsvp', protect, rsvpEvent);

export default router;
