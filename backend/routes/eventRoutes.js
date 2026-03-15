const express = require('express');
const {
  createEvent,
  getEvents,
  getEvent,
  rsvpEvent,
  getMyEvents
} = require('../controllers/eventController.js');
const { protect } = require('../middleware/auth.js');

const router = express.Router();

router.route('/')
  .get(protect, getEvents)
  .post(protect, createEvent);

router.get('/my-events', protect, getMyEvents);

router.route('/:id')
  .get(protect, getEvent);

router.post('/:id/rsvp', protect, rsvpEvent);

module.exports = router;
