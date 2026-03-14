import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Avatar, Typography, Button, Box, Chip
} from '@mui/material';
import { Favorite, Star } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { useNavigate } from 'react-router-dom';
import api from '../services/api';
import { toast } from 'react-toastify';

const LikesReceived = () => {
  const [likes, setLikes] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    loadLikes();
  }, []);

  const loadLikes = async () => {
    try {
      const { data } = await api.get('/dating/likes-received');
      setLikes(data);
    } catch (error) {
      toast.error('Failed to load likes');
    }
  };

  const handleLikeBack = async (userId) => {
    try {
      const { data } = await api.post(`/dating/like/${userId}`, {
        likeType: 'like'
      });

      if (data.isMatch) {
        toast.success("🎉 It's a Match! Start chatting now!");
      }

      loadLikes();
    } catch (error) {
      toast.error('Failed to like back');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          People Who Like You
        </Typography>

        <Grid container spacing={2}>
          {likes.map((like) => (
            <Grid item xs={12} md={6} key={like._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Avatar
                      src={like.fromUser.profilePicture}
                      sx={{ width: 80, height: 80, mr: 2 }}
                    >
                      {like.fromUser.username?.[0]}
                    </Avatar>
                    <Box flex={1}>
                      <Typography variant="h6">
                        {like.fromUser.username}, {like.fromUser.age}
                      </Typography>
                      <Typography variant="body2" color="text.secondary">
                        {like.fromUser.country}
                      </Typography>
                      {like.likeType === 'super-like' && (
                        <Chip
                          icon={<Star />}
                          label="Super Liked You!"
                          color="secondary"
                          size="small"
                          sx={{ mt: 0.5 }}
                        />
                      )}
                    </Box>
                  </Box>

                  {like.message && (
                    <Box sx={{ p: 2, bgcolor: 'grey.100', borderRadius: 1, mb: 2 }}>
                      <Typography variant="body2">"{like.message}"</Typography>
                    </Box>
                  )}

                  <Typography variant="body2" paragraph>
                    {like.fromUser.bio || 'No bio available'}
                  </Typography>

                  {like.fromUser.interests && like.fromUser.interests.length > 0 && (
                    <Box mb={2}>
                      {like.fromUser.interests.slice(0, 3).map((interest, idx) => (
                        <Chip key={idx} label={interest} size="small" sx={{ mr: 0.5 }} />
                      ))}
                    </Box>
                  )}

                  <Box display="flex" gap={1}>
                    <Button
                      variant="contained"
                      startIcon={<Favorite />}
                      onClick={() => handleLikeBack(like.fromUser._id)}
                      fullWidth
                    >
                      Like Back
                    </Button>
                    <Button
                      variant="outlined"
                      onClick={() => navigate(`/profile/${like.fromUser._id}`)}
                      fullWidth
                    >
                      View Profile
                    </Button>
                  </Box>
                </CardContent>
              </Card>
            </Grid>
          ))}

          {likes.length === 0 && (
            <Grid item xs={12}>
              <Box textAlign="center" py={8}>
                <Typography variant="h6" color="text.secondary">
                  No likes yet. Keep swiping!
                </Typography>
              </Box>
            </Grid>
          )}
        </Grid>
      </Container>
    </>
  );
};

export default LikesReceived;
