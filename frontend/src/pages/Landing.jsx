import { Link } from 'react-router-dom';
import { Container, Typography, Button, Box, Grid, Paper } from '@mui/material';
import { Favorite, Security, People } from '@mui/icons-material';

const Landing = () => {
  return (
    <Box>
      <Box sx={{ bgcolor: 'primary.main', color: 'white', py: 8 }}>
        <Container maxWidth="lg">
          <Typography variant="h2" gutterBottom align="center">
            HIV Connect Pro
          </Typography>
          <Typography variant="h5" gutterBottom align="center">
            Find Love & Meaningful Relationships - Dating for People Living with HIV
          </Typography>
          <Typography variant="body1" align="center" sx={{ mt: 2, opacity: 0.9 }}>
            Connect with singles who understand your journey. No stigma, no judgment - just genuine connections.
          </Typography>
          <Box sx={{ mt: 4, display: 'flex', justifyContent: 'center', gap: 2 }}>
            <Button component={Link} to="/register" variant="contained" color="secondary" size="large">
              Start Dating Now
            </Button>
            <Button component={Link} to="/login" variant="outlined" sx={{ color: 'white', borderColor: 'white' }} size="large">
              Login
            </Button>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="lg" sx={{ py: 8 }}>
        <Grid container spacing={4}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Favorite sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Find Your Match</Typography>
              <Typography>Meet singles who understand your journey. Browse profiles, send likes, and start conversations</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <Security sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Date with Confidence</Typography>
              <Typography>No stigma, no judgment. Everyone here understands. Focus on finding love, not explaining your status</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper sx={{ p: 3, textAlign: 'center', height: '100%' }}>
              <People sx={{ fontSize: 60, color: 'primary.main', mb: 2 }} />
              <Typography variant="h5" gutterBottom>Real Relationships</Typography>
              <Typography>From casual dating to serious relationships - find what you're looking for</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Box sx={{ mt: 6, p: 4, bgcolor: 'grey.100', borderRadius: 2 }}>
          <Typography variant="h4" gutterBottom align="center">How It Works</Typography>
          <Grid container spacing={3} sx={{ mt: 2 }}>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" align="center">1. Create Profile</Typography>
              <Typography align="center">Share your interests, photos, and what you're looking for</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" align="center">2. Browse Matches</Typography>
              <Typography align="center">Discover compatible singles based on your preferences</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" align="center">3. Connect</Typography>
              <Typography align="center">Send match requests and start chatting with people you like</Typography>
            </Grid>
            <Grid item xs={12} md={3}>
              <Typography variant="h6" align="center">4. Meet & Date</Typography>
              <Typography align="center">Take it offline and build real relationships</Typography>
            </Grid>
          </Grid>
        </Box>
      </Container>
    </Box>
  );
};

export default Landing;
