import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  Tabs, Tab, TextField, MenuItem, LinearProgress
} from '@mui/material';
import { Add, LocalHospital, Medication, TrendingUp } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const HealthTracker = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({});
  const [reminders, setReminders] = useState([]);
  const [logs, setLogs] = useState([]);
  const [newReminder, setNewReminder] = useState({
    medicationName: '',
    dosage: '',
    frequency: 'once-daily',
    reminderTimes: ['09:00'],
    startDate: new Date().toISOString().split('T')[0]
  });

  useEffect(() => {
    loadStats();
    loadReminders();
    loadLogs();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/health/stats');
      setStats(data);
    } catch (error) {
      console.error('Failed to load stats');
    }
  };

  const loadReminders = async () => {
    try {
      const { data } = await api.get('/health/reminders');
      setReminders(data);
    } catch (error) {
      toast.error('Failed to load reminders');
    }
  };

  const loadLogs = async () => {
    try {
      const { data } = await api.get('/health/logs');
      setLogs(data);
    } catch (error) {
      toast.error('Failed to load logs');
    }
  };

  const handleCreateReminder = async () => {
    try {
      await api.post('/health/reminders', newReminder);
      toast.success('Reminder created!');
      loadReminders();
      setNewReminder({
        medicationName: '',
        dosage: '',
        frequency: 'once-daily',
        reminderTimes: ['09:00'],
        startDate: new Date().toISOString().split('T')[0]
      });
    } catch (error) {
      toast.error('Failed to create reminder');
    }
  };

  const handleLogMedication = async (reminderId, taken) => {
    try {
      await api.post(`/health/reminders/${reminderId}/log`, {
        taken,
        time: new Date().toLocaleTimeString()
      });
      toast.success(taken ? 'Medication logged!' : 'Marked as missed');
      loadReminders();
      loadStats();
    } catch (error) {
      toast.error('Failed to log medication');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>Health Tracker</Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <TrendingUp sx={{ mr: 1, color: 'primary.main' }} />
                  <Typography variant="h6">Medication Adherence</Typography>
                </Box>
                <Typography variant="h3">{stats.medicationAdherence || 0}%</Typography>
                <LinearProgress
                  variant="determinate"
                  value={stats.medicationAdherence || 0}
                  sx={{ mt: 2 }}
                />
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <LocalHospital sx={{ mr: 1, color: 'success.main' }} />
                  <Typography variant="h6">Total Logs</Typography>
                </Box>
                <Typography variant="h3">{stats.totalLogs || 0}</Typography>
              </CardContent>
            </Card>
          </Grid>
          <Grid item xs={12} md={4}>
            <Card>
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <Medication sx={{ mr: 1, color: 'secondary.main' }} />
                  <Typography variant="h6">Active Reminders</Typography>
                </Box>
                <Typography variant="h3">{reminders.length}</Typography>
              </CardContent>
            </Card>
          </Grid>
        </Grid>

        <Card>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Medication Reminders" />
            <Tab label="Add Reminder" />
            <Tab label="Health Logs" />
          </Tabs>

          <CardContent>
            {tab === 0 && (
              <Grid container spacing={2}>
                {reminders.map(reminder => (
                  <Grid item xs={12} md={6} key={reminder._id}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6">{reminder.medicationName}</Typography>
                        <Typography variant="body2" color="text.secondary">
                          Dosage: {reminder.dosage}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Frequency: {reminder.frequency}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Times: {reminder.reminderTimes.join(', ')}
                        </Typography>
                        <Box mt={2} display="flex" gap={1}>
                          <Button
                            size="small"
                            variant="contained"
                            color="success"
                            onClick={() => handleLogMedication(reminder._id, true)}
                          >
                            Taken
                          </Button>
                          <Button
                            size="small"
                            variant="outlined"
                            color="error"
                            onClick={() => handleLogMedication(reminder._id, false)}
                          >
                            Missed
                          </Button>
                        </Box>
                      </CardContent>
                    </Card>
                  </Grid>
                ))}
              </Grid>
            )}

            {tab === 1 && (
              <Box>
                <TextField
                  fullWidth
                  label="Medication Name"
                  margin="normal"
                  value={newReminder.medicationName}
                  onChange={(e) => setNewReminder({ ...newReminder, medicationName: e.target.value })}
                />
                <TextField
                  fullWidth
                  label="Dosage"
                  margin="normal"
                  value={newReminder.dosage}
                  onChange={(e) => setNewReminder({ ...newReminder, dosage: e.target.value })}
                />
                <TextField
                  fullWidth
                  select
                  label="Frequency"
                  margin="normal"
                  value={newReminder.frequency}
                  onChange={(e) => setNewReminder({ ...newReminder, frequency: e.target.value })}
                >
                  <MenuItem value="once-daily">Once Daily</MenuItem>
                  <MenuItem value="twice-daily">Twice Daily</MenuItem>
                  <MenuItem value="three-times-daily">Three Times Daily</MenuItem>
                </TextField>
                <TextField
                  fullWidth
                  type="date"
                  label="Start Date"
                  margin="normal"
                  InputLabelProps={{ shrink: true }}
                  value={newReminder.startDate}
                  onChange={(e) => setNewReminder({ ...newReminder, startDate: e.target.value })}
                />
                <Button
                  fullWidth
                  variant="contained"
                  sx={{ mt: 2 }}
                  onClick={handleCreateReminder}
                >
                  Create Reminder
                </Button>
              </Box>
            )}

            {tab === 2 && (
              <Box>
                {logs.map((log, idx) => (
                  <Card key={idx} variant="outlined" sx={{ mb: 2 }}>
                    <CardContent>
                      <Typography variant="subtitle1">{log.logType}</Typography>
                      <Typography variant="body2" color="text.secondary">
                        {log.description || log.medicationName || log.symptomName}
                      </Typography>
                      <Typography variant="caption">
                        {new Date(log.createdAt).toLocaleString()}
                      </Typography>
                    </CardContent>
                  </Card>
                ))}
              </Box>
            )}
          </CardContent>
        </Card>
      </Container>
    </>
  );
};

export default HealthTracker;
