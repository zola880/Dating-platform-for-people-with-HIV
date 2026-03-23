const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const path = require('path');
const http = require('http');
const { Server } = require('socket.io');
const connectDB = require('./config/db');
const postRoutes = require('./routes/postRoutes');
const Message = require('./models/Message'); // Added to save messages via socket

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();
const server = http.createServer(app);
const io = new Server(server, {
  cors: {
    origin: "http://localhost:3000", // adjust to your frontend URL
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // Parse JSON request bodies
app.use(express.urlencoded({ extended: true })); // Parse URL-encoded request bodies

// Serve static files (uploads folder for profile pictures)
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// Route imports
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const messageRoutes = require('./routes/messageRoutes');

//post routes
app.use('/api/posts', postRoutes);

// Route definitions
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/messages', messageRoutes);

// Root route - API status
app.get('/', (req, res) => {
  res.json({ message: 'Safe Connect API is running...' });
});

// Error handling middleware for 404 - Route not found
app.use((req, res) => {
  res.status(404).json({ message: `Route ${req.originalUrl} not found` });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error('Global error:', err);
  
  // Handle multer errors
  if (err.code === 'LIMIT_FILE_SIZE') {
    return res.status(400).json({ message: 'File size too large. Maximum size is 5MB.' });
  }
  
  res.status(500).json({ message: 'Server error', error: err.message });
});

// Socket.IO logic
io.on('connection', (socket) => {
  console.log('New client connected:', socket.id);

  // Join a room based on user ID (for private messaging)
  socket.on('join', (userId) => {
    socket.join(userId);
    console.log(`User ${userId} joined room ${userId}`);
  });

  // Handle new private message via socket
  socket.on('private message', async ({ senderId, receiverId, content, attachments }) => {
    try {
      // Save to database (optional: if you prefer to save via API, you can skip this)
      const message = await Message.create({
        sender: senderId,
        receiver: receiverId,
        content,
        attachments: attachments || [] // ensure attachments is an array
      });
      const populatedMessage = await Message.findById(message._id)
        .populate('sender', 'name profilePicture')
        .populate('receiver', 'name profilePicture');
      // Broadcast to receiver's room
      io.to(receiverId).emit('new message', populatedMessage);
      // Acknowledge sender (optional)
      socket.emit('message sent', populatedMessage);
    } catch (error) {
      console.error('Socket message error:', error);
    }
  });

  socket.on('disconnect', () => {
    console.log('Client disconnected:', socket.id);
  });
});

// Define port
const PORT = process.env.PORT || 5000;

// Start server using the HTTP server instead of app.listen
server.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});