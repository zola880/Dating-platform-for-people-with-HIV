import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Paper, Avatar, Typography, Box, Button, Chip, Grid
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const Profile = () => {
  const { id } = useParams();
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadUser();
  }, [id]);

  const loadUser = async () => {
    try {
      const { data } = await api.get(`/users/${id}`);
      setUser(data);
    } catch (error) {
      toast.error('Failed to load profile');
    }
  };

  const handleSendMatch = async () => {
    try {
      await api.post(`/matches/${id}`);
      toast.success('Match request sent!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send match request');
    }
  };

  if (!user) return null;

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Box display="flex" alignItems="center" mb={3}>
            <Avatar
              src={user.profilePicture}
              sx={{ width: 120, height: 120, mr: 3 }}
            >
              {user.username?.[0]}
            </Avatar>
            <Box>
              <Typography variant="h4">{user.username}</Typography>
              <Typography variant="body1" color="text.secondary">
                {user.age} • {user.gender} • {user.country}
              </Typography>
              <Box mt={1}>
                {user.isOnline && (
                  <Chip label="Online" color="success" size="small" />
                )}
              </Box>
            </Box>
          </Box>

          <Typography variant="h6" gutterBottom>About</Typography>
          <Typography variant="body1" paragraph>
            {user.bio || 'No bio available'}
          </Typography>

          {user.interests && user.interests.length > 0 && (
            <>
              <Typography variant="h6" gutterBottom>Interests</Typography>
              <Box mb={3}>
                {user.interests.map((interest, idx) => (
                  <Chip key={idx} label={interest} sx={{ mr: 1, mb: 1 }} />
                ))}
              </Box>
            </>
          )}

          <Button variant="contained" onClick={handleSendMatch} fullWidth>
            Send Match Request
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default Profile;
