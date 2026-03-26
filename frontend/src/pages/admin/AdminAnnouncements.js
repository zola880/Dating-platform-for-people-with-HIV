import React, { useState, useEffect } from 'react';
import { sendAnnouncement } from '../../utils/adminApi';
import Spinner from '../../components/Spinner';
import './AdminAnnouncements.css';

const AdminAnnouncements = () => {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [audience, setAudience] = useState('all');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState('');
  const [error, setError] = useState('');
  const [announcements, setAnnouncements] = useState([
    // Sample data - you can fetch from backend if you add an endpoint
    {
      id: 1,
      title: 'Welcome to Embrace!',
      message: 'We are excited to have you join our community. Stay safe and connect meaningfully.',
      audience: 'all',
      createdAt: new Date('2025-01-15'),
      createdBy: 'System'
    },
    {
      id: 2,
      title: 'Safety Tips',
      message: 'Remember to never share personal information and report any suspicious behavior.',
      audience: 'all',
      createdAt: new Date('2025-02-01'),
      createdBy: 'Admin'
    }
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !message.trim()) {
      setError('Please fill in both title and message');
      return;
    }

    setLoading(true);
    setError('');
    setSuccess('');

    try {
      await sendAnnouncement(title, message, audience);
      setSuccess('Announcement sent successfully!');
      setTitle('');
      setMessage('');
      // Add to local list
      setAnnouncements([
        {
          id: Date.now(),
          title,
          message,
          audience,
          createdAt: new Date(),
          createdBy: 'You'
        },
        ...announcements
      ]);
      setTimeout(() => setSuccess(''), 3000);
    } catch (error) {
      console.error('Error sending announcement:', error);
      setError('Failed to send announcement');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="admin-announcements">
      <div className="admin-header">
        <h1>System Announcements</h1>
        <p>Create and manage announcements for all users</p>
      </div>

      <div className="announcements-layout">
        <div className="create-announcement">
          <h2>Create New Announcement</h2>
          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}
          
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label>Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter announcement title"
                maxLength="100"
              />
            </div>
            
            <div className="form-group">
              <label>Message</label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Write your announcement message..."
                rows="5"
              />
            </div>
            
            <div className="form-group">
              <label>Audience</label>
              <select value={audience} onChange={(e) => setAudience(e.target.value)}>
                <option value="all">All Users</option>
                <option value="active">Active Users Only</option>
                <option value="new">New Users (less than 7 days)</option>
              </select>
            </div>
            
            <button type="submit" disabled={loading}>
              {loading ? 'Sending...' : 'Send Announcement'}
            </button>
          </form>
        </div>

        <div className="announcements-list">
          <h2>Previous Announcements</h2>
          {announcements.length === 0 ? (
            <p className="no-announcements">No announcements yet</p>
          ) : (
            announcements.map((announcement) => (
              <div key={announcement.id} className="announcement-card">
                <div className="announcement-header">
                  <h3>{announcement.title}</h3>
                  <div className="announcement-meta">
                    <span className="audience-badge">
                      {announcement.audience === 'all' ? '🌍 All Users' : 
                       announcement.audience === 'active' ? '✅ Active Users' : '🆕 New Users'}
                    </span>
                    <span className="announcement-date">
                      {new Date(announcement.createdAt).toLocaleDateString()}
                    </span>
                  </div>
                </div>
                <p className="announcement-message">{announcement.message}</p>
                <div className="announcement-footer">
                  <small>Sent by: {announcement.createdBy}</small>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default AdminAnnouncements;