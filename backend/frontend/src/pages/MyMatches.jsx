import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Avatar, Typography, Button, Box, Chip, Tabs, Tab
} from '@mui/material';
import { Message, Favorite } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const MyMatches = () => {
  const [tab, setTab] = useState(0);
  const [matches, setMatches] = useState([]);
  const [pendingMatches, setPendingMatches] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadMatches();
    loadPendingMatches();
  }, []);

  const loadMatches = async () => {
    try {
      const { data } = await api.get('/matches');
      setMatches(data);
    } catch (error) {
      toast.error('Failed to load matches');
    }
  };

  const loadPendingMatches = async () => {
    try {
      const { data } = await api.get('/matches/pending');
      setPendingMatches(data);
    } catch (error) {
      console.error('Failed to load pending matches');
    }
  };

  const handleAcceptMatch = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}`, { status: 'accepted' });
      toast.success('Match accepted!');
      loadMatches();
      loadPendingMatches();
    } catch (error) {
      toast.error('Failed to accept match');
    }
  };

  const handleRejectMatch = async (matchId) => {
    try {
      await api.put(`/matches/${matchId}`, { status: 'rejected' });
      toast.success('Match rejected');
      loadPendingMatches();
    } catch (error) {
      toast.error('Failed to reject match');
    }
  };

  const getOtherUser = (match, currentUserId) => {
    return match.user1._id === currentUserId ? match.user2 : match.user1;
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          My Matches
        </Typography>

        <Tabs value={tab} onChange={(e, v) => setTab(v)} sx={{ mb: 3 }}>
          <Tab label={`Matches (${matches.length})`} />
          <Tab label={`Pending (${pendingMatches.length})`} />
        </Tabs>

        {tab === 0 && (
          <Grid container spacing={2}>
            {matches.map((match) => {
              const otherUser = getOtherUser(match, localStorage.getItem('userId'));
              return (
                <Grid item xs={12} md={4} key={match._id}>
                  <Card>
                    <CardContent>
                      <Box display="flex" flexDirection="column" alignItems="center">
                        <Avatar
                          src={otherUser.profilePicture}
                          sx={{ width: 100, height: 100, mb: 2 }}
                        >
                          {otherUser.username?.[0]}
                        </Avatar>
                        <Typography variant="h6">
                          {otherUser.username}, {otherUser.age}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" gutterBottom>
                          {otherUser.country}
                        </Typography>
                        
                        {otherUser.lookingFor && (
                          <Chip
                            label={otherUser.lookingFor.replace('-', ' ')}
                            size="small"
                            sx={{ mb: 2 }}
                          />
                        )}

                        <Box display="flex" gap={1} width="100%">
                          <Button
                            variant="contained"
                            startIcon={<Message />}
                            onClick={() => navigate(`/messages/${otherUser._id}`)}
                            fullWidth
                          >
                            Message
                          </Button>
                          <Button
                            variant="outlined"
                            onClick={() => navigate(`/profile/${otherUser._id}`)}
                            fullWidth
                          >
                            Profile
                          </Button>
                        </Box>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}

            {matches.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No matches yet. Keep swiping!
                  </Typography>
                  <Button
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => navigate('/swipe')}
                  >
                    Start Swiping
                  </Button>
                </Box>
              </Grid>
            )}
          </Grid>
        )}

        {tab === 1 && (
          <Grid container spacing={2}>
            {pendingMatches.map((match) => (
              <Grid item xs={12} md={6} key={match._id}>
                <Card>
                  <CardContent>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Avatar
                        src={match.user1.profilePicture}
                        sx={{ width: 80, height: 80, mr: 2 }}
                      >
                        {match.user1.username?.[0]}
                      </Avatar>
                      <Box flex={1}>
                        <Typography variant="h6">
                          {match.user1.username}, {match.user1.age}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          {match.user1.country}
                        </Typography>
                      </Box>
                    </Box>

                    <Typography variant="body2" paragraph>
                      {match.user1.bio || 'No bio available'}
                    </Typography>

                    <Box display="flex" gap={1}>
                      <Button
                        variant="contained"
                        color="success"
                        onClick={() => handleAcceptMatch(match._id)}
                        fullWidth
                      >
                        Accept
                      </Button>
                      <Button
                        variant="outlined"
                        color="error"
                        onClick={() => handleRejectMatch(match._id)}
                        fullWidth
                      >
                        Reject
                      </Button>
                    </Box>
                  </CardContent>
                </Card>
              </Grid>
            ))}

            {pendingMatches.length === 0 && (
              <Grid item xs={12}>
                <Box textAlign="center" py={8}>
                  <Typography variant="h6" color="text.secondary">
                    No pending match requests
                  </Typography>
                </Box>
              </Grid>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

export default MyMatches;
