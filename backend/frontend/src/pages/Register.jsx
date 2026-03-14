import { useState, useContext } from 'react';
import { Link } from 'react-router-dom';
import {
  Container, Paper, TextField, Button, Typography, Box,
  MenuItem, Chip, FormControlLabel, Checkbox
} from '@mui/material';
import { AuthContext } from '../context/AuthContext';
import { toast } from 'react-toastify';

const Register = () => {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    age: '',
    gender: '',
    country: '',
    bio: '',
    interests: [],
    lookingFor: 'open-to-anything',
    relationshipStatus: 'single',
    occupation: '',
    education: '',
    hasChildren: false,
    wantsChildren: 'prefer-not-to-say',
    smoking: 'prefer-not-to-say',
    drinking: 'prefer-not-to-say'
  });
  const [interestInput, setInterestInput] = useState('');
  const { register } = useContext(AuthContext);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(formData);
      toast.success('Registration successful!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Registration failed');
    }
  };

  const addInterest = () => {
    if (interestInput && !formData.interests.includes(interestInput)) {
      setFormData({ ...formData, interests: [...formData.interests, interestInput] });
      setInterestInput('');
    }
  };

  return (
    <Container maxWidth="sm" sx={{ mt: 4, mb: 4 }}>
      <Paper sx={{ p: 4 }}>
        <Typography variant="h4" gutterBottom align="center">
          Create Account
        </Typography>
        <form onSubmit={handleSubmit}>
          <TextField
            fullWidth
            label="Username"
            margin="normal"
            value={formData.username}
            onChange={(e) => setFormData({ ...formData, username: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Email"
            type="email"
            margin="normal"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Password"
            type="password"
            margin="normal"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            required
          />
          <TextField
            fullWidth
            label="Age"
            type="number"
            margin="normal"
            value={formData.age}
            onChange={(e) => setFormData({ ...formData, age: e.target.value })}
            required
          />
          <TextField
            fullWidth
            select
            label="Gender"
            margin="normal"
            value={formData.gender}
            onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
            required
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
            required
          />
          <TextField
            fullWidth
            label="Bio"
            multiline
            rows={3}
            margin="normal"
            placeholder="Tell others about yourself..."
            value={formData.bio}
            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
          />
          
          <TextField
            fullWidth
            select
            label="What are you looking for?"
            margin="normal"
            value={formData.lookingFor}
            onChange={(e) => setFormData({ ...formData, lookingFor: e.target.value })}
          >
            <MenuItem value="serious-relationship">Serious Relationship</MenuItem>
            <MenuItem value="casual-dating">Casual Dating</MenuItem>
            <MenuItem value="friendship">Friendship</MenuItem>
            <MenuItem value="marriage">Marriage</MenuItem>
            <MenuItem value="open-to-anything">Open to Anything</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Relationship Status"
            margin="normal"
            value={formData.relationshipStatus}
            onChange={(e) => setFormData({ ...formData, relationshipStatus: e.target.value })}
          >
            <MenuItem value="single">Single</MenuItem>
            <MenuItem value="divorced">Divorced</MenuItem>
            <MenuItem value="widowed">Widowed</MenuItem>
            <MenuItem value="its-complicated">It's Complicated</MenuItem>
          </TextField>

          <TextField
            fullWidth
            label="Occupation"
            margin="normal"
            value={formData.occupation}
            onChange={(e) => setFormData({ ...formData, occupation: e.target.value })}
          />

          <TextField
            fullWidth
            label="Education"
            margin="normal"
            value={formData.education}
            onChange={(e) => setFormData({ ...formData, education: e.target.value })}
          />

          <TextField
            fullWidth
            select
            label="Do you have children?"
            margin="normal"
            value={formData.hasChildren}
            onChange={(e) => setFormData({ ...formData, hasChildren: e.target.value === 'true' })}
          >
            <MenuItem value="false">No</MenuItem>
            <MenuItem value="true">Yes</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Do you want children?"
            margin="normal"
            value={formData.wantsChildren}
            onChange={(e) => setFormData({ ...formData, wantsChildren: e.target.value })}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="maybe">Maybe</MenuItem>
            <MenuItem value="have-and-want-more">Have and want more</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Smoking"
            margin="normal"
            value={formData.smoking}
            onChange={(e) => setFormData({ ...formData, smoking: e.target.value })}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="occasionally">Occasionally</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </TextField>

          <TextField
            fullWidth
            select
            label="Drinking"
            margin="normal"
            value={formData.drinking}
            onChange={(e) => setFormData({ ...formData, drinking: e.target.value })}
          >
            <MenuItem value="yes">Yes</MenuItem>
            <MenuItem value="no">No</MenuItem>
            <MenuItem value="socially">Socially</MenuItem>
            <MenuItem value="prefer-not-to-say">Prefer not to say</MenuItem>
          </TextField>

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
            Register
          </Button>
        </form>
        <Box sx={{ mt: 2, textAlign: 'center' }}>
          <Typography variant="body2">
            Already have an account? <Link to="/login">Login</Link>
          </Typography>
        </Box>
      </Paper>
    </Container>
  );
};

export default Register;
