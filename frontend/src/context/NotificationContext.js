// frontend/src/context/NotificationContext.js
import React, { createContext, useContext, useEffect, useRef, useState } from 'react';
import { useAuth } from './AuthContext';
import io from 'socket.io-client';
import { requestNotificationPermission, showNotification } from '../utils/notifications';
import API from '../utils/api';

const NotificationContext = createContext();

export const useNotification = () => useContext(NotificationContext);

export const NotificationProvider = ({ children }) => {
  const { user } = useAuth();
  const socketRef = useRef(null);
  const [socket, setSocket] = useState(null);

  useEffect(() => {
    if (!user?._id) return;

    // Request notification permission once
    requestNotificationPermission();

    // Connect to socket
    const newSocket = io('http://localhost:5001');
    socketRef.current = newSocket;
    setSocket(newSocket);

    newSocket.emit('join', user._id);

    // Listen for new messages
    newSocket.on('new message', (newMsg) => {
      // Only show if the message is from someone else and not the active chat (we'll need active chat path)
      // But we can't access location here easily, so we'll check if the current page is the chat with the sender.
      // We'll rely on the Chat component to suppress notifications when needed.
      // For now, always show if not own message.
      if (newMsg.sender._id !== user._id) {
        showNotification(
          `New message from ${newMsg.sender.name}`,
          newMsg.content || 'Sent a file',
          '/logo192.png',
          `/chat/${newMsg.sender._id}`
        );
      }
    });

    // Listen for incoming calls
    newSocket.on('incoming-call', async ({ offer, from }) => {
      // Fetch caller's name
      let callerName = 'Someone';
      try {
        const response = await API.get(`/users/${from}`);
        callerName = response.data.name;
      } catch (err) {
        console.error('Failed to fetch caller name:', err);
      }
      showNotification(
        'Incoming call',
        `${callerName} is calling you`,
        '/logo192.png',
        `/chat/${from}`
      );
    });

    return () => {
      if (socketRef.current) {
        socketRef.current.disconnect();
      }
    };
  }, [user]);

  const value = {
    socket,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};