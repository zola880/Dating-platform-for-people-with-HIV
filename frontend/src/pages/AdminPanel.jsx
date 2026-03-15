import { useState, useEffect } from 'react';
import {
  Container, Grid, Paper, Typography, Box, Table, TableBody,
  TableCell, TableHead, TableRow, Button, Tabs, Tab
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const AdminPanel = () => {
  const [tab, setTab] = useState(0);
  const [stats, setStats] = useState({});
  const [users, setUsers] = useState([]);
  const [reports, setReports] = useState([]);

  useEffect(() => {
    loadStats();
    loadUsers();
    loadReports();
  }, []);

  const loadStats = async () => {
    try {
      const { data } = await api.get('/admin/stats');
      setStats(data);
    } catch (error) {
      toast.error('Failed to load stats');
    }
  };

  const loadUsers = async () => {
    try {
      const { data } = await api.get('/admin/users');
      setUsers(data);
    } catch (error) {
      toast.error('Failed to load users');
    }
  };

  const loadReports = async () => {
    try {
      const { data } = await api.get('/reports');
      setReports(data);
    } catch (error) {
      toast.error('Failed to load reports');
    }
  };

  const handleBanUser = async (userId) => {
    try {
      await api.put(`/admin/users/${userId}/ban`);
      loadUsers();
      toast.success('User status updated');
    } catch (error) {
      toast.error('Failed to update user');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4 }}>
        <Typography variant="h4" gutterBottom>
          Admin Panel
        </Typography>

        <Grid container spacing={3} sx={{ mb: 4 }}>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">{stats.totalUsers}</Typography>
              <Typography color="text.secondary">Total Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">{stats.activeUsers}</Typography>
              <Typography color="text.secondary">Active Users</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">{stats.totalPosts}</Typography>
              <Typography color="text.secondary">Total Posts</Typography>
            </Paper>
          </Grid>
          <Grid item xs={12} md={3}>
            <Paper sx={{ p: 3, textAlign: 'center' }}>
              <Typography variant="h4">{stats.pendingReports}</Typography>
              <Typography color="text.secondary">Pending Reports</Typography>
            </Paper>
          </Grid>
        </Grid>

        <Paper>
          <Tabs value={tab} onChange={(e, v) => setTab(v)}>
            <Tab label="Users" />
            <Tab label="Reports" />
          </Tabs>

          <Box sx={{ p: 3 }}>
            {tab === 0 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Username</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Actions</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {users.map(user => (
                    <TableRow key={user._id}>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.email}</TableCell>
                      <TableCell>{user.isBanned ? 'Banned' : 'Active'}</TableCell>
                      <TableCell>
                        <Button
                          size="small"
                          color={user.isBanned ? 'success' : 'error'}
                          onClick={() => handleBanUser(user._id)}
                        >
                          {user.isBanned ? 'Unban' : 'Ban'}
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}

            {tab === 1 && (
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Reporter</TableCell>
                    <TableCell>Reason</TableCell>
                    <TableCell>Status</TableCell>
                    <TableCell>Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {reports.map(report => (
                    <TableRow key={report._id}>
                      <TableCell>{report.reporter?.username}</TableCell>
                      <TableCell>{report.reason}</TableCell>
                      <TableCell>{report.status}</TableCell>
                      <TableCell>{new Date(report.createdAt).toLocaleDateString()}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </Box>
        </Paper>
      </Container>
    </>
  );
};

export default AdminPanel;
