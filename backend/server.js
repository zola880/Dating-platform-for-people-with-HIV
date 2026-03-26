const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const Message = require('./models/Message');
const adminRoutes = require('./routes/adminRoutes');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static files
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));
app.use('/api/admin', adminRoutes);

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

// Post routes
app.use('/api/posts', postRoutes);

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root route
app.get('/', (req, res) => {
  res.json({ message: 'Safe Connect API is running...' });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
  }
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room based on user ID
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle new private message via socket
  socket.on('private message', async ({ senderId, receiverId, content, attachments }) => {
    try {
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        attachments: attachments || []
      });
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture');
      io.to(receiverId).emit('new message', populatedMessage);
      socket.emit('message sent', populatedMessage);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  // --- Call signaling handlers ---
  socket.on('call-user', ({ offer, to, from, type }) => {
    console.log(`Call from ${from} to ${to} (${type})`);
    io.to(to).emit('incoming-call', { offer, from, type });
  });

  socket.on('accept-call', ({ answer, to, from }) => {
    console.log(`Call accepted from ${from} to ${to}`);
    io.to(to).emit('call-accepted', { answer, from });
  });

  socket.on('reject-call', ({ to, from }) => {
    console.log(`Call rejected from ${from} to ${to}`);
    io.to(to).emit('call-rejected', { from });
  });

  socket.on('end-call', ({ to, from }) => {
    console.log(`Call ended between ${from} and ${to}`);
    io.to(to).emit('call-ended', { from });
  });

  socket.on('ice-candidate', ({ candidate, to, from }) => {
    io.to(to).emit('ice-candidate', { candidate, from });
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Start server
const PORT = process.env.PORT || 5000;
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});