const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const { createServer } = require('http');
const rateLimit = require('express-rate-limit');
const connectDB = require('./config/db.js');
const { errorHandler, notFound } = require('./middleware/errorHandler.js');
const { initializeSocket } = require('./utils/socket.js');

// Routes
const authRoutes = require('./routes/authRoutes.js');
const userRoutes = require('./routes/userRoutes.js');
const postRoutes = require('./routes/postRoutes.js');
const matchRoutes = require('./routes/matchRoutes.js');
const messageRoutes = require('./routes/messageRoutes.js');
const notificationRoutes = require('./routes/notificationRoutes.js');
const reportRoutes = require('./routes/reportRoutes.js');
const adminRoutes = require('./routes/adminRoutes.js');
const groupRoutes = require('./routes/groupRoutes.js');
const eventRoutes = require('./routes/eventRoutes.js');
const storyRoutes = require('./routes/storyRoutes.js');
const healthRoutes = require('./routes/healthRoutes.js');
const uploadRoutes = require('./routes/uploadRoutes.js');
const datingRoutes = require('./routes/datingRoutes.js');

dotenv.config();

const app = express();
const httpServer = createServer(app);

// Connect to MongoDB
const startServer = async () => {
  try {
    await connectDB();

    // Initialize Socket.io
    const io = initializeSocket(httpServer);

    // Middleware
    app.use(cors());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per window
    });
    app.use('/api/', limiter);

    // Serve static files
    app.use('/uploads', express.static('uploads'));

    // Routes
    app.use('/api/auth', authRoutes);
    app.use('/api/users', userRoutes);
    app.use('/api/posts', postRoutes);
    app.use('/api/matches', matchRoutes);
    app.use('/api/messages', messageRoutes);
    app.use('/api/notifications', notificationRoutes);
    app.use('/api/reports', reportRoutes);
    app.use('/api/admin', adminRoutes);
    app.use('/api/groups', groupRoutes);
    app.use('/api/events', eventRoutes);
    app.use('/api/stories', storyRoutes);
    app.use('/api/health', healthRoutes);
    app.use('/api/upload', uploadRoutes);
    app.use('/api/dating', datingRoutes);

    app.get('/', (req, res) => {
      res.json({ message: 'API is running' });
    });

    // Error handling
    app.use(notFound);
    app.use(errorHandler);

    const PORT = process.env.PORT || 5000;

    httpServer.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  } catch (error) {
    console.error(`Error: ${error.message}`);
    process.exit(1);
  }
};

startServer();