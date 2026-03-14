import { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import {
  Container, Grid, Paper, List, ListItem, ListItemAvatar, ListItemText,
  Avatar, TextField, IconButton, Box, Typography
} from '@mui/material';
import { Send } from '@mui/icons-material';
import Navbar from '../components/Navbar';
import { SocketContext } from '../context/SocketContext';
import { AuthContext } from '../context/AuthContext';
import api from '../services/api';
import { toast } from 'react-toastify';

const Messages = () => {
  const { userId } = useParams();
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const [selectedUser, setSelectedUser] = useState(null);
  const { socket } = useContext(SocketContext);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    loadConversations();
  }, []);

  useEffect(() => {
    if (userId) {
      loadConversation(userId);
    }
  }, [userId]);

  useEffect(() => {
    if (socket) {
      socket.on('newMessage', (message) => {
        if (message.fromUser._id === selectedUser?._id || message.toUser._id === selectedUser?._id) {
          setMessages(prev => [...prev, message]);
        }
      });

      return () => socket.off('newMessage');
    }
  }, [socket, selectedUser]);

  const loadConversations = async () => {
    try {
      const { data } = await api.get('/messages');
      setConversations(data);
    } catch (error) {
      toast.error('Failed to load conversations');
    }
  };

  const loadConversation = async (userId) => {
    try {
      const { data } = await api.get(`/messages/${userId}`);
      setMessages(data);
      
      const userRes = await api.get(`/users/${userId}`);
      setSelectedUser(userRes.data);
    } catch (error) {
      toast.error('Failed to load messages');
    }
  };

  const sendMessage = () => {
    if (!newMessage.trim() || !selectedUser) return;

    socket.emit('sendMessage', {
      toUserId: selectedUser._id,
      text: newMessage
    });

    setNewMessage('');
  };

  return (
    <>
      <Navbar />
      <Container maxWidth="lg" sx={{ mt: 4, height: 'calc(100vh - 150px)' }}>
        <Grid container spacing={2} sx={{ height: '100%' }}>
          <Grid item xs={12} md={4}>
            <Paper sx={{ height: '100%', overflow: 'auto' }}>
              <List>
                {conversations.map((conv) => {
                  const otherUser = conv.lastMessage.fromUser._id === user._id
                    ? conv.lastMessage.toUser
                    : conv.lastMessage.fromUser;
                  
                  return (
                    <ListItem
                      key={conv._id}
                      button
                      onClick={() => loadConversation(otherUser._id)}
                    >
                      <ListItemAvatar>
                        <Avatar src={otherUser.profilePicture}>
                          {otherUser.username?.[0]}
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={otherUser.username}
                        secondary={conv.lastMessage.text}
                      />
                    </ListItem>
                  );
                })}
              </List>
            </Paper>
          </Grid>

          <Grid item xs={12} md={8}>
            <Paper sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              {selectedUser ? (
                <>
                  <Box sx={{ p: 2, borderBottom: 1, borderColor: 'divider' }}>
                    <Typography variant="h6">{selectedUser.username}</Typography>
                  </Box>
                  
                  <Box sx={{ flex: 1, overflow: 'auto', p: 2 }}>
                    {messages.map((msg) => (
                      <Box
                        key={msg._id}
                        sx={{
                          display: 'flex',
                          justifyContent: msg.fromUser._id === user._id ? 'flex-end' : 'flex-start',
                          mb: 2
                        }}
                      >
                        <Paper
                          sx={{
                            p: 1.5,
                            maxWidth: '70%',
                            bgcolor: msg.fromUser._id === user._id ? 'primary.main' : 'grey.200',
                            color: msg.fromUser._id === user._id ? 'white' : 'black'
                          }}
                        >
                          <Typography variant="body2">{msg.text}</Typography>
                        </Paper>
                      </Box>
                    ))}
                  </Box>

                  <Box sx={{ p: 2, borderTop: 1, borderColor: 'divider', display: 'flex' }}>
                    <TextField
                      fullWidth
                      placeholder="Type a message..."
                      value={newMessage}
                      onChange={(e) => setNewMessage(e.target.value)}
                      onKeyPress={(e) => e.key === 'Enter' && sendMessage()}
                    />
                    <IconButton color="primary" onClick={sendMessage}>
                      <Send />
                    </IconButton>
                  </Box>
                </>
              ) : (
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', height: '100%' }}>
                  <Typography color="text.secondary">Select a conversation</Typography>
                </Box>
              )}
            </Paper>
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default Messages;
