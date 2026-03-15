import { useState, useEffect } from 'react';
import {
  Container, Paper, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, Typography, Button, Box
} from '@mui/material';
import Navbar from '../components/Navbar';
import api from '../services/api';
import { toast } from 'react-toastify';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);

  useEffect(() => {
    loadNotifications();
  }, []);

  const loadNotifications = async () => {
    try {
      const { data } = await api.get('/notifications');
      setNotifications(data);
    } catch (error) {
      toast.error('Failed to load notifications');
    }
  };

  const markAllAsRead = async () => {
    try {
      await api.put('/notifications/read-all');
      loadNotifications();
      toast.success('All notifications marked as read');
    } catch (error) {
      toast.error('Failed to mark notifications as read');
    }
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="md" sx={{ mt: 4 }}>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
          <Typography variant="h4">Notifications</Typography>
          <Button onClick={markAllAsRead}>Mark All as Read</Button>
        </Box>

        <Paper>
          <List>
            {notifications.map((notif) => (
              <ListItem
                key={notif._id}
                sx={{ bgcolor: notif.read ? 'transparent' : 'action.hover' }}
              >
                <ListItemAvatar>
                  <Avatar src={notif.relatedUser?.profilePicture}>
                    {notif.relatedUser?.username?.[0]}
                  </Avatar>
                </ListItemAvatar>
                <ListItemText
                  primary={notif.content}
                  secondary={new Date(notif.createdAt).toLocaleString()}
                />
              </ListItem>
            ))}
            {notifications.length === 0 && (
              <ListItem>
                <ListItemText primary="No notifications" />
              </ListItem>
            )}
          </List>
        </Paper>
      </Container>
    </>
  );
};

export default Notifications;
