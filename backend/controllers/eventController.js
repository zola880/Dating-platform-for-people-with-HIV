const Event=require('../models/Event.js')
const Notification=require('../models/Notification.js')

// @desc    Create event
// @route   POST /api/events
// @access  Private
exports.createEvent = async (req, res) => {
  try {
    const {
      title, description, eventType, category, startDate, endDate,
      location, virtualLink, maxAttendees, isPublic, tags
    } = req.body;

    const event = await Event.create({
      title,
      description,
      eventType,
      category,
      startDate,
      endDate,
      location,
      virtualLink,
      maxAttendees,
      isPublic,
      tags: tags || [],
      organizer: req.user._id
    });

    const populatedEvent = await Event.findById(event._id)
      .populate('organizer', 'username profilePicture');

    res.status(201).json(populatedEvent);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get all events
// @route   GET /api/events
// @access  Private
exports.getEvents = async (req, res) => {
  try {
    const { category, eventType, upcoming } = req.query;
    
    let query = { isPublic: true };
    
    if (category) {
      query.category = category;
    }
    
    if (eventType) {
      query.eventType = eventType;
    }
    
    if (upcoming === 'true') {
      query.startDate = { $gte: new Date() };
    }

    const events = await Event.find(query)
      .populate('organizer', 'username profilePicture')
      .populate('attendees.user', 'username profilePicture')
      .sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get single event
// @route   GET /api/events/:id
// @access  Private
exports.getEvent = async (req, res) => {
  try {
    const event = await Event.findById(req.params.id)
      .populate('organizer', 'username profilePicture')
      .populate('attendees.user', 'username profilePicture');

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    RSVP to event
// @route   POST /api/events/:id/rsvp
// @access  Private
exports.rsvpEvent = async (req, res) => {
  try {
    const { status } = req.body; // going, interested, not-going
    const event = await Event.findById(req.params.id);

    if (!event) {
      return res.status(404).json({ message: 'Event not found' });
    }

    // Check if max attendees reached
    if (event.maxAttendees && status === 'going') {
      const goingCount = event.attendees.filter(a => a.status === 'going').length;
      if (goingCount >= event.maxAttendees) {
        return res.status(400).json({ message: 'Event is full' });
      }
    }

    // Remove existing RSVP
    event.attendees = event.attendees.filter(
      a => a.user.toString() !== req.user._id.toString()
    );

    // Add new RSVP if not "not-going"
    if (status !== 'not-going') {
      event.attendees.push({
        user: req.user._id,
        status
      });
    }

    await event.save();

    // Notify organizer
    if (event.organizer.toString() !== req.user._id.toString()) {
      await Notification.create({
        user: event.organizer,
        type: 'system',
        content: `${req.user.username} is ${status} for ${event.title}`,
        relatedUser: req.user._id
      });
    }

    res.json(event);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// @desc    Get user's events
// @route   GET /api/events/my-events
// @access  Private
exports.getMyEvents = async (req, res) => {
  try {
    const events = await Event.find({
      $or: [
        { organizer: req.user._id },
        { 'attendees.user': req.user._id }
      ]
    })
    .populate('organizer', 'username profilePicture')
    .populate('attendees.user', 'username profilePicture')
    .sort({ startDate: 1 });

    res.json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
