import { useState, useEffect } from 'react';
import {
  Container, Card, CardMedia, CardContent, Typography, Box, IconButton,
  Chip, Button, Dialog, DialogContent, TextField
} from '@mui/material';
import {
  Favorite, Close, Star, LocationOn, Work, School
} from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const SwipeMatch = () => {
  const [profiles, setProfiles] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [showMessage, setShowMessage] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    loadProfiles();
  }, []);

  const loadProfiles = async () => {
    try {
      const { data } = await api.get('/dating/discover');
      setProfiles(data);
    } catch (error) {
      toast.error('Failed to load profiles');
    }
  };

  const handleLike = async (likeType) => {
    if (currentIndex >= profiles.length) return;

    try {
      const { data } = await api.post(`/dating/like/${profiles[currentIndex]._id}`, {
        likeType,
        message: likeType === 'super-like' ? message : ''
      });

      if (data.isMatch) {
        toast.success("🎉 It's a Match! Start chatting now!");
      } else {
        toast.success(likeType === 'super-like' ? 'Super Like sent!' : 'Like sent!');
      }

      setMessage('');
      setShowMessage(false);
      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 >= profiles.length) {
        loadProfiles();
        setCurrentIndex(0);
      }
    } catch (error) {
      toast.error('Failed to send like');
    }
  };

  const handlePass = async () => {
    if (currentIndex >= profiles.length) return;

    try {
      await api.post(`/dating/like/${profiles[currentIndex]._id}`, {
        likeType: 'pass'
      });

      setCurrentIndex(currentIndex + 1);

      if (currentIndex + 1 >= profiles.length) {
        loadProfiles();
        setCurrentIndex(0);
      }
    } catch (error) {
      console.error('Failed to pass');
    }
  };

  const currentProfile = profiles[currentIndex];

  if (!currentProfile) {
    return (
      <>
        <Navbar />
        <Container maxWidth="sm" sx={{ mt: 4 }}>
          <Typography variant="h5" align="center">
            No more profiles to show. Check back later!
          </Typography>
        </Container>
      </>
    );
  }

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Card sx={{ position: 'relative' }}>
          <CardMedia
            component="img"
            height="500"
            image={currentProfile.profilePicture || 'https://via.placeholder.com/400x500?text=No+Photo'}
            alt={currentProfile.username}
            sx={{ objectFit: 'cover' }}
          />
          
          <CardContent>
            <Typography variant="h4" gutterBottom>
              {currentProfile.username}, {currentProfile.age}
            </Typography>

            {currentProfile.lookingFor && (
              <Chip 
                label={currentProfile.lookingFor.replace('-', ' ')} 
                color="primary" 
                size="small" 
                sx={{ mr: 1, mb: 1 }}
              />
            )}

            <Box display="flex" alignItems="center" mb={1}>
              <LocationOn sx={{ fontSize: 18, mr: 0.5 }} />
              <Typography variant="body2">{currentProfile.country}</Typography>
            </Box>

            {currentProfile.occupation && (
              <Box display="flex" alignItems="center" mb={1}>
                <Work sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">{currentProfile.occupation}</Typography>
              </Box>
            )}

            {currentProfile.education && (
              <Box display="flex" alignItems="center" mb={1}>
                <School sx={{ fontSize: 18, mr: 0.5 }} />
                <Typography variant="body2">{currentProfile.education}</Typography>
              </Box>
            )}

            <Typography variant="body1" paragraph sx={{ mt: 2 }}>
              {currentProfile.bio || 'No bio available'}
            </Typography>

            {currentProfile.interests && currentProfile.interests.length > 0 && (
              <Box>
                <Typography variant="subtitle2" gutterBottom>Interests</Typography>
                {currentProfile.interests.map((interest, idx) => (
                  <Chip key={idx} label={interest} size="small" sx={{ mr: 0.5, mb: 0.5 }} />
                ))}
              </Box>
            )}
          </CardContent>

          <Box 
            display="flex" 
            justifyContent="center" 
            gap={2} 
            sx={{ p: 2, bgcolor: 'background.paper' }}
          >
            <IconButton
              size="large"
              sx={{
                bgcolor: 'error.light',
                color: 'white',
                '&:hover': { bgcolor: 'error.main' }
              }}
              onClick={handlePass}
            >
              <Close fontSize="large" />
            </IconButton>

            <IconButton
              size="large"
              sx={{
                bgcolor: 'secondary.light',
                color: 'white',
                '&:hover': { bgcolor: 'secondary.main' }
              }}
              onClick={() => setShowMessage(true)}
            >
              <Star fontSize="large" />
            </IconButton>

            <IconButton
              size="large"
              sx={{
                bgcolor: 'success.light',
                color: 'white',
                '&:hover': { bgcolor: 'success.main' }
              }}
              onClick={() => handleLike('like')}
            >
              <Favorite fontSize="large" />
            </IconButton>
          </Box>
        </Card>

        <Typography variant="body2" align="center" sx={{ mt: 2 }}>
          {profiles.length - currentIndex} profiles remaining
        </Typography>

        <Dialog open={showMessage} onClose={() => setShowMessage(false)}>
          <DialogContent>
            <Typography variant="h6" gutterBottom>
              Send a Super Like with a message!
            </Typography>
            <TextField
              fullWidth
              multiline
              rows={3}
              placeholder="Say something nice..."
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              sx={{ mt: 2 }}
            />
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={() => handleLike('super-like')}
            >
              Send Super Like
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default SwipeMatch;
