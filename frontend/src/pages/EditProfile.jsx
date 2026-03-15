import { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, MenuItem, Chip, Box
} from '@mui/material';
import Navbar from '../components/Navbar';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const EditProfile = () => {
  const { user, loadUser } = useContext(AuthContext);
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    bio: '',
    age: '',
    gender: '',
    country: '',
    interests: [],
    hivStatusVisibility: 'matches-only',
    isAnonymous: false
  });
  const [interestInput, setInterestInput] = useState('');

  useEffect(() => {
    if (user) {
      setFormData({
        username: user.username || '',
        bio: user.bio || '',
        age: user.age || '',
        gender: user.gender || '',
        country: user.country || '',
        interests: user.interests || [],
        hivStatusVisibility: user.hivStatusVisibility || 'matches-only',
        isAnonymous: user.isAnonymous || false
      });
    }
  }, [user]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/users/profile', formData);
      await loadUser();
      toast.success('Profile updated!');
      navigate(`/profile/${user._id}`);
    } catch (error) {
      toast.error('Failed to update profile');
    }
  };

  const addInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput] });
      setInterestInput('');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="sm" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Edit Profile
          </Typography>
          <form onSubmit={handleSubmit}>
            <TextField
              fullWidth
              label="Username"
              margin="normal"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            />
            <TextField
              fullWidth
              label="Bio"
              multiline
              rows={3}
              margin="normal"
              value={formData.bio}
              onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
            />
            <TextField
              fullWidth
              label="Age"
              type="number"
              margin="normal"
              value={formData.age}
              onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            />
            <TextField
              fullWidth
              select
              label="Gender"
              margin="normal"
              value={formData.gender}
              onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            >
              <MenuItem value="male">Male</MenuItem>
              <MenuItem value="female">Female</MenuItem>
              <MenuItem value="non-binary">Non-binary</MenuItem>
              <MenuItem value="other">Other</MenuItem>
              <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
            </TextField>
            <TextField
              fullWidth
              label="Country"
              margin="normal"
              value={formData.country}
              onChange={(e) => setFormData({ ...formData, country: e.target.value })}
            />
            
            <Box sx={{ mt: 2 }}>
              <TextField
                fullWidth
                label="Add Interest"
                value={interestInput}
                onChange={(e) => setInterestInput(e.target.value)}
                onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addInterest())}
              />
              <Button onClick={addInterest} sx={{ mt: 1 }}>Add</Button>
              <Box sx={{ mt: 1 }}>
                {formData.interests.map((interest, idx) => (
                  <Chip
                    key={idx}
                    label={interest}
                    onDelete={() => setFormData({
                      ...formData,
                      interests: formData.interests.filter((_, i) => i !== idx)
                    })}
                    sx={{ mr: 1, mb: 1 }}
                  />
                ))}
              </Box>
            </Box>

            <Button type="submit" fullWidth variant="contained" sx={{ mt: 3 }}>
              Save Changes
            </Button>
          </form>
        </Paper>
      </Container>
    </>
  );
};

export default EditProfile;
