import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, Chip
} from '@mui/material';
import { Add, Event as EventIcon, LocationOn, CalendarToday } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const Events = () => {
  const [events, setEvents] = useState([]);
  const [myEvents, setMyEvents] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    eventType: 'virtual',
    category: 'support-group',
    startDate: '',
    endDate: '',
    virtualLink: ''
  });

  useEffect(() => {
    loadEvents();
    loadMyEvents();
  }, []);

  const loadEvents = async () => {
    try {
      const { data } = await api.get('/events?upcoming=true');
      setEvents(data);
    } catch (error) {
      toast.error('Failed to load events');
    }
  };

  const loadMyEvents = async () => {
    try {
      const { data } = await api.get('/events/my-events');
      setMyEvents(data);
    } catch (error) {
      console.error('Failed to load my events');
    }
  };

  const handleCreateEvent = async () => {
    try {
      await api.post('/events', formData);
      toast.success('Event created!');
      setOpenDialog(false);
      loadEvents();
      loadMyEvents();
    } catch (error) {
      toast.error('Failed to create event');
    }
  };

  const handleRSVP = async (eventId, status) => {
    try {
      await api.post(`/events/${eventId}/rsvp`, { status });
      toast.success(`RSVP updated to ${status}!`);
      loadEvents();
      loadMyEvents();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to RSVP');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Events</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Event
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>My Events</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {myEvents.map(event => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} flexWrap="wrap">
                    <Chip label={event.eventType} size="small" />
                    <Chip label={event.category} size="small" />
                    <Chip label={`${event.attendees.length} attending`} size="small" />
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" gutterBottom>Upcoming Events</Typography>
        <Grid container spacing={2}>
          {events.map(event => (
            <Grid item xs={12} md={6} key={event._id}>
              <Card>
                <CardContent>
                  <Typography variant="h6" gutterBottom>{event.title}</Typography>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {event.description}
                  </Typography>
                  <Box display="flex" alignItems="center" mb={1}>
                    <CalendarToday sx={{ fontSize: 16, mr: 1 }} />
                    <Typography variant="body2">
                      {new Date(event.startDate).toLocaleDateString()}
                    </Typography>
                  </Box>
                  <Box display="flex" gap={1} flexWrap="wrap" mb={2}>
                    <Chip label={event.eventType} size="small" />
                    <Chip label={event.category} size="small" />
                    <Chip label={`${event.attendees.length} attending`} size="small" />
                  </Box>
                  <Box display="flex" gap={1}>
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleRSVP(event._id, 'going')}
                    >
                      Going
                    </Button>
                    <Button
                      size="small"
                      variant="outlined"
                      onClick={() => handleRSVP(event._id, 'interested')}
                    >
                      Interested
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Event</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Event Title"
              margin="normal"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
            />
            <TextField
              fullWidth
              label="Description"
              multiline
              rows={3}
              margin="normal"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Event Type"
              margin="normal"
              value={formData.eventType}
              onChange={(e) => setFormData({ ...formData, eventType: e.target.value })}
            >
              <MenuItem value="virtual">Virtual</MenuItem>
              <MenuItem value="in-person">In-Person</MenuItem>
              <MenuItem value="hybrid">Hybrid</MenuItem>
            </TextField>
            <TextField
              fullWidth
              select
              label="Category"
              margin="normal"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="support-group">Support Group</MenuItem>
              <MenuItem value="awareness">Awareness</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="fundraiser">Fundraiser</MenuItem>
            </TextField>
            <TextField
              fullWidth
              type="datetime-local"
              label="Start Date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.startDate}
              onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
            />
            <TextField
              fullWidth
              type="datetime-local"
              label="End Date"
              margin="normal"
              InputLabelProps={{ shrink: true }}
              value={formData.endDate}
              onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
            />
            <TextField
              fullWidth
              label="Virtual Link (if applicable)"
              margin="normal"
              value={formData.virtualLink}
              onChange={(e) => setFormData({ ...formData, virtualLink: e.target.value })}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleCreateEvent}
            >
              Create Event
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default Events;
