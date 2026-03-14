import { Card, CardContent, Avatar, Typography, Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import api from '../services/api';

const UserCard = ({ user, onMatchSent }) => {
  const navigate = useNavigate();

  const handleSendMatch = async () => {
    try {
      await api.post(`/matches/${user._id}`);
      toast.success('Match request sent!');
      onMatchSent && onMatchSent();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send match request');
    }
  };

  return (
    <Card sx={{ mb: 2 }}>
      <CardContent>
        <Box display="flex" alignItems="center" mb={2}>
          <Avatar
            src={user.profilePicture}
            sx={{ width: 60, height: 60, mr: 2 }}
          >
            {user.username?.[0]}
          </Avatar>
          <Box>
            <Typography variant="h6">{user.username}</Typography>
            <Typography variant="body2" color="text.secondary">
              {user.age} • {user.gender} • {user.country}
            </Typography>
          </Box>
        </Box>
        
        <Typography variant="body2" sx={{ mb: 2 }}>
          {user.bio || 'No bio available'}
        </Typography>

        {user.interests && user.interests.length > 0 && (
          <Typography variant="caption" color="text.secondary">
            Interests: {user.interests.join(', ')}
          </Typography>
        )}

        <Box mt={2} display="flex" gap={1}>
          <Button
            variant="contained"
            fullWidth
            onClick={handleSendMatch}
          >
            Send Match Request
          </Button>
          <Button
            variant="outlined"
            fullWidth
            onClick={() => navigate(`/profile/${user._id}`)}
          >
            View Profile
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};

export default UserCard;
