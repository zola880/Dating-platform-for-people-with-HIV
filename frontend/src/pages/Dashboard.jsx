import { useState, useEffect, useContext } from 'react';
import { Container, Grid, Paper, Typography, TextField, Button, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import PostCard from '../components/PostCard';
import UserCard from '../components/UserCard';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Dashboard = () => {
  const [posts, setPosts] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [newPost, setNewPost] = useState('');
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadPosts();
    loadRecommendations();
  }, []);

  const loadPosts = async () => {
    try {
      const { data } = await api.get('/posts');
      setPosts(data);
    } catch (error) {
      toast.error('Failed to load posts');
    }
  };

  const loadRecommendations = async () => {
    try {
      const { data } = await api.get('/users/recommendations');
      setRecommendations(data);
    } catch (error) {
      console.error('Failed to load recommendations');
    }
  };

  const handleCreatePost = async () => {
    if (!newPost.trim()) return;
    
    try {
      await api.post('/posts', { text: newPost });
      setNewPost('');
      loadPosts();
      toast.success('Post created!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to create post');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Paper sx={{ p: 3, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Create Post
              </Typography>
              <TextField
                fullWidth
                multiline
                rows={3}
                placeholder="What's on your mind?"
                value={newPost}
                onChange={(e) => setNewPost(e.target.value)}
              />
              <Button
                variant="contained"
                sx={{ mt: 2 }}
                onClick={handleCreatePost}
              >
                Post
              </Button>
            </Paper>

            <Typography variant="h5" gutterBottom>
              Feed
            </Typography>
            {posts.map(post => (
              <PostCard key={post._id} post={post} onUpdate={loadPosts} />
            ))}
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 2, mb: 3 }}>
              <Typography variant="h6" gutterBottom>
                Welcome, {user?.username}!
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Connect with others in a safe, supportive environment
              </Typography>
            </Paper>

            <Typography variant="h6" gutterBottom>
              Recommended Matches
            </Typography>
            {recommendations.slice(0, 3).map(user => (
              <UserCard key={user._id} user={user} onMatchSent={loadRecommendations} />
            ))}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Dashboard;
