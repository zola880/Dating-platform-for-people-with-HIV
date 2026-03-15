import { useState, useEffect } from 'react';
import {
  Container, Paper, Typography, TextField, MenuItem, Button,
  FormGroup, FormControlLabel, Checkbox, Slider, Box
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const DatingPreferences = () => {
  const [preferences, setPreferences] = useState({
    lookingFor: 'open-to-anything',
    interestedIn: ['everyone'],
    ageRange: { min: 18, max: 99 },
    maxDistance: 100
  });

  useEffect(() => {
    loadPreferences();
  }, []);

  const loadPreferences = async () => {
    try {
      const { data } = await api.get('/dating/preferences');
      setPreferences(data);
    } catch (error) {
      console.error('Failed to load preferences');
    }
  };

  const handleSave = async () => {
    try {
      await api.post('/dating/preferences', preferences);
      toast.success('Preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  const handleGenderChange = (gender) => {
    let newInterests = [...preferences.interestedIn];
    
    if (gender === 'everyone') {
      newInterests = ['everyone'];
    } else {
      newInterests = newInterests.filter(g => g !== 'everyone');
      if (newInterests.includes(gender)) {
        newInterests = newInterests.filter(g => g !== gender);
      } else {
        newInterests.push(gender);
      }
      if (newInterests.length === 0) {
        newInterests = ['everyone'];
      }
    }
    
    setPreferences({ ...preferences, interestedIn: newInterests });
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Paper sx={{ p: 4 }}>
          <Typography variant="h4" gutterBottom>
            Dating Preferences
          </Typography>

          <TextField
            fullWidth
            select
            label="What are you looking for?"
            margin="normal"
            value={preferences.lookingFor}
            onChange={(e) => setPreferences({ ...preferences, lookingFor: e.target.value })}
          >
            <MenuItem value="serious-relationship">Serious Relationship</MenuItem>
            <MenuItem value="casual-dating">Casual Dating</MenuItem>
            <MenuItem value="friendship">Friendship</MenuItem>
            <MenuItem value="marriage">Marriage</MenuItem>
            <MenuItem value="open-to-anything">Open to Anything</MenuItem>
          </TextField>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>Interested in:</Typography>
            <FormGroup>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.interestedIn.includes('everyone')}
                    onChange={() => handleGenderChange('everyone')}
                  />
                }
                label="Everyone"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.interestedIn.includes('male')}
                    onChange={() => handleGenderChange('male')}
                  />
                }
                label="Men"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.interestedIn.includes('female')}
                    onChange={() => handleGenderChange('female')}
                  />
                }
                label="Women"
              />
              <FormControlLabel
                control={
                  <Checkbox
                    checked={preferences.interestedIn.includes('non-binary')}
                    onChange={() => handleGenderChange('non-binary')}
                  />
                }
                label="Non-binary"
              />
            </FormGroup>
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Age Range: {preferences.ageRange.min} - {preferences.ageRange.max}
            </Typography>
            <Slider
              value={[preferences.ageRange.min, preferences.ageRange.max]}
              onChange={(e, newValue) => setPreferences({
                ...preferences,
                ageRange: { min: newValue[0], max: newValue[1] }
              })}
              valueLabelDisplay="auto"
              min={18}
              max={99}
            />
          </Box>

          <Box sx={{ mt: 3 }}>
            <Typography gutterBottom>
              Maximum Distance: {preferences.maxDistance} km
            </Typography>
            <Slider
              value={preferences.maxDistance}
              onChange={(e, newValue) => setPreferences({
                ...preferences,
                maxDistance: newValue
              })}
              valueLabelDisplay="auto"
              min={10}
              max={500}
              step={10}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{ mt: 4 }}
            onClick={handleSave}
          >
            Save Preferences
          </Button>
        </Paper>
      </Container>
    </>
  );
};

export default DatingPreferences;
