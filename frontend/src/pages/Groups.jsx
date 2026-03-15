import { useState, useEffect } from 'react';
import {
  Container, Grid, Card, CardContent, Typography, Button, Box,
  Dialog, DialogTitle, DialogContent, TextField, MenuItem, Chip
} from '@mui/material';
import { Add, People } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Groups = () => {
  const [groups, setGroups] = useState([]);
  const [myGroups, setMyGroups] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    category: 'support',
    isPrivate: false
  });
  const navigate = useNavigate();

  useEffect(() => {
    loadGroups();
    loadMyGroups();
  }, []);

  const loadGroups = async () => {
    try {
      const { data } = await api.get('/groups');
      setGroups(data);
    } catch (error) {
      toast.error('Failed to load groups');
    }
  };

  const loadMyGroups = async () => {
    try {
      const { data } = await api.get('/groups/my-groups');
      setMyGroups(data);
    } catch (error) {
      console.error('Failed to load my groups');
    }
  };

  const handleCreateGroup = async () => {
    try {
      await api.post('/groups', formData);
      toast.success('Group created!');
      setOpenDialog(false);
      loadGroups();
      loadMyGroups();
      setFormData({ name: '', description: '', category: 'support', isPrivate: false });
    } catch (error) {
      toast.error('Failed to create group');
    }
  };

  const handleJoinGroup = async (groupId) => {
    try {
      await api.post(`/groups/${groupId}/join`);
      toast.success('Joined group!');
      loadGroups();
      loadMyGroups();
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to join group');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={3}>
          <Typography variant="h4">Groups</Typography>
          <Button
            variant="contained"
            startIcon={<Add />}
            onClick={() => setOpenDialog(true)}
          >
            Create Group
          </Button>
        </Box>

        <Typography variant="h5" gutterBottom>My Groups</Typography>
        <Grid container spacing={2} sx={{ mb: 4 }}>
          {myGroups.map(group => (
            <Grid item xs={12} md={4} key={group._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <People sx={{ mr: 1 }} />
                    <Typography variant="h6">{group.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {group.description}
                  </Typography>
                  <Chip label={group.category} size="small" sx={{ mr: 1 }} />
                  <Chip label={`${group.members.length} members`} size="small" />
                  <Button
                    fullWidth
                    variant="outlined"
                    sx={{ mt: 2 }}
                    onClick={() => navigate(`/groups/${group._id}`)}
                  >
                    View Group
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Typography variant="h5" gutterBottom>Discover Groups</Typography>
        <Grid container spacing={2}>
          {groups.filter(g => !myGroups.find(mg => mg._id === g._id)).map(group => (
            <Grid item xs={12} md={4} key={group._id}>
              <Card>
                <CardContent>
                  <Box display="flex" alignItems="center" mb={1}>
                    <People sx={{ mr: 1 }} />
                    <Typography variant="h6">{group.name}</Typography>
                  </Box>
                  <Typography variant="body2" color="text.secondary" paragraph>
                    {group.description}
                  </Typography>
                  <Chip label={group.category} size="small" sx={{ mr: 1 }} />
                  <Chip label={`${group.members.length} members`} size="small" />
                  <Button
                    fullWidth
                    variant="contained"
                    sx={{ mt: 2 }}
                    onClick={() => handleJoinGroup(group._id)}
                  >
                    Join Group
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>

        <Dialog open={openDialog} onClose={() => setOpenDialog(false)} maxWidth="sm" fullWidth>
          <DialogTitle>Create New Group</DialogTitle>
          <DialogContent>
            <TextField
              fullWidth
              label="Group Name"
              margin="normal"
              value={formData.name}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
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
              label="Category"
              margin="normal"
              value={formData.category}
              onChange={(e) => setFormData({ ...formData, category: e.target.value })}
            >
              <MenuItem value="support">Support</MenuItem>
              <MenuItem value="social">Social</MenuItem>
              <MenuItem value="health">Health</MenuItem>
              <MenuItem value="advocacy">Advocacy</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </TextField>
            <Button
              fullWidth
              variant="contained"
              sx={{ mt: 2 }}
              onClick={handleCreateGroup}
            >
              Create Group
            </Button>
          </DialogContent>
        </Dialog>
      </Container>
    </>
  );
};

export default Groups;
