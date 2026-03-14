import { Server } from 'socket.io';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import Message from '../models/Message.js';
import { moderateContent } from './aiModeration.js';

const userSockets = new Map(); // userId -> socketId

export const initializeSocket = (server) => {
  const io = new Server(server, {
    cors: {
      origin: ['http://localhost:5173', 'http://127.0.0.1:5173'],
      methods: ['GET', 'POST'],
      credentials: true
    }
  });

  // Authentication middleware
  io.use(async (socket, next) => {
    try {
      const token = socket.handshake.auth.token;
      if (!token) {
        return next(new Error('Authentication error'));
      }
      
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await User.findById(decoded.id);
      
      if (!user || user.isBanned) {
        return next(new Error('Authentication error'));
      }
      
      socket.userId = user._id.toString();
      next();
    } catch (error) {
      next(new Error('Authentication error'));
    }
  });

  io.on('connection', async (socket) => {
    console.log(`User connected: ${socket.userId}`);
    
    // Store socket connection
    userSockets.set(socket.userId, socket.id);
    
    // Update user online status
    await User.findByIdAndUpdate(socket.userId, { isOnline: true });
    
    // Broadcast online status
    io.emit('userOnline', { userId: socket.userId });

    // Join user's personal room
    socket.join(socket.userId);

    // Handle private messages
    socket.on('sendMessage', async (data) => {
      try {
        const { toUserId, text } = data;
        
        // AI moderation
        const moderation = await moderateContent(text);
        
        const message = await Message.create({
          fromUser: socket.userId,
          toUser: toUserId,
          text,
          isModerated: moderation.isOffensive,
          moderationFlag: moderation.flag
        });

        const populatedMessage = await Message.findById(message._id)
          .populate('fromUser', 'username profilePicture')
          .populate('toUser', 'username profilePicture');

        // Send to recipient if online
        const recipientSocketId = userSockets.get(toUserId);
        if (recipientSocketId) {
          io.to(recipientSocketId).emit('newMessage', populatedMessage);
        }
        
        // Send back to sender
        socket.emit('messageSent', populatedMessage);
        
        // If moderated, notify sender
        if (moderation.isOffensive) {
          socket.emit('messageModerated', {
            message: 'Your message was flagged for review',
            flag: moderation.flag
          });
        }
      } catch (error) {
        socket.emit('error', { message: 'Failed to send message' });
      }
    });

    // Handle typing indicator
    socket.on('typing', (data) => {
      const recipientSocketId = userSockets.get(data.toUserId);
      if (recipientSocketId) {
        io.to(recipientSocketId).emit('userTyping', {
          userId: socket.userId,
          isTyping: data.isTyping
        });
      }
    });

    // Handle disconnect
    socket.on('disconnect', async () => {
      console.log(`User disconnected: ${socket.userId}`);
      userSockets.delete(socket.userId);
      
      // Update user online status
      await User.findByIdAndUpdate(socket.userId, { 
        isOnline: false,
        lastLogin: new Date()
      });
      
      // Broadcast offline status
      io.emit('userOffline', { userId: socket.userId });
    });
  });

  return io;
};
