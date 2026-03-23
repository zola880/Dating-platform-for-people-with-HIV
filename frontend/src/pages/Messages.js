import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Spinner from '../components/Spinner';
import './Messages.css';

const Messages = () => {
  // const { user } = useAuth();
  const [conversations, setConversations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchConversations();
  }, []);

  const fetchConversations = async () => {
    try {
      setLoading(true);
      const response = await API.get('/messages/conversations');
      setConversations(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching conversations:', error);
      setError('Failed to load conversations. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture && profilePicture !== 'default-avatar.png') {
      return `http://localhost:5001/uploads/${profilePicture}`;
    }
    return '/default-avatar.png';
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="messages-container">
      <div className="messages-header">
        <h1>Messages</h1>
        <p>Your conversations with community members</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      {conversations.length === 0 ? (
        <div className="no-conversations">
          <div className="no-conversations-content">
            <h3>No messages yet</h3>
            <p>Start a conversation by messaging someone from the dashboard!</p>
            <Link to="/dashboard" className="browse-btn">
              Browse Members
            </Link>
          </div>
        </div>
      ) : (
        <div className="conversations-list">
          {conversations.map((conversation) => (
            <Link
              to={`/chat/${conversation.user._id}`}
              key={conversation.user._id}
              className="conversation-item"
            >
              <div className="conversation-avatar">
                <img
                  src={getProfilePictureUrl(conversation.user.profilePicture)}
                  alt={conversation.user.name}
                />
                {conversation.unreadCount > 0 && (
                  <span className="unread-badge">{conversation.unreadCount}</span>
                )}
              </div>
              <div className="conversation-info">
                <div className="conversation-header">
                  <h3>{conversation.user.name}</h3>
                  <span className="conversation-time">
                    {formatTime(conversation.lastMessageTime)}
                  </span>
                </div>
                <p className="conversation-preview">
                  {conversation.lastMessage.length > 50
                    ? conversation.lastMessage.substring(0, 50) + '...'
                    : conversation.lastMessage}
                </p>
                {conversation.user.age && (
                  <span className="conversation-detail">
                    {conversation.user.age} years • {conversation.user.gender}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  );
};

export default Messages;