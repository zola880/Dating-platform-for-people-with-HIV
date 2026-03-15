import { useState, useEffect } from 'react';
import { Container, Grid, Typography, TextField, MenuItem, Box } from '@mui/material';
import Navbar from '../components/Navbar';
import UserCard from '../components/UserCard';
import api from '../services/api';
import { toast } from 'react-toastify';

const Discover = () => {
  const [users, setUsers] = useState([]);
  const [filters, setFilters] = useState({
    query: '',
    gender: '',
    age: '',
    country: ''
  });

  useEffect(() => {
    searchUsers();
  }, [filters]);

  const searchUsers = async () => {
    try {
      const params = new URLSearchParams();
      Object.keys(filters).forEach(key => {
        if (filters[key]) params.append(key, filters[key]);
      });
      
      const { data } = await api.get(`/users/search?${params}`);
      setUsers(data);
    } catch (error) {
      toast.error('Failed to search users');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Discover People
        </Typography>

        <Box sx={{ mb: 3 }}>
          <Grid container spacing={2}>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Search"
                value={filters.query}
                onChange={(e) => setFilters({ ...filters, query: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                select
                label="Gender"
                value={filters.gender}
                onChange={(e) => setFilters({ ...filters, gender: e.target.value })}
              >
                <MenuItem value="">All</MenuItem>
                <MenuItem value="male">Male</MenuItem>
                <MenuItem value="female">Female</MenuItem>
                <MenuItem value="non-binary">Non-binary</MenuItem>
              </TextField>
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Age Range"
                placeholder="18-30"
                value={filters.age}
                onChange={(e) => setFilters({ ...filters, age: e.target.value })}
              />
            </Grid>
            <Grid item xs={12} md={3}>
              <TextField
                fullWidth
                label="Country"
                value={filters.country}
                onChange={(e) => setFilters({ ...filters, country: e.target.value })}
              />
            </Grid>
          </Grid>
        </Box>

        <Grid container spacing={2}>
          {users.map(user => (
            <Grid item xs={12} md={6} key={user._id}>
              <UserCard user={user} onMatchSent={searchUsers} />
            </Grid>
          ))}
        </Grid>
      </Container>
    </>
  );
};

export default Discover;
