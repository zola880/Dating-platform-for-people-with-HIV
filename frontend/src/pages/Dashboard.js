import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import Spinner from '../components/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await API.get('/users');
      setUsers(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users. Please try again.');
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

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard embrace">
      <div className="dashboard-header">
        <div className="user-greeting">
          <h1>Hello, {user?.name}</h1>
          <p>Your journey continues</p>
        </div>
        <div className="user-stats">
          <div className="stat-item">
            <span className="stat-value">{users.length}</span>
            <span className="stat-label">Members</span>
          </div>
          <div className="stat-item">
            <span className="stat-value">0</span>
            <span className="stat-label">Matches</span>
          </div>
        </div>
      </div>

      <div className="members-section">
        <h2>Discover new connections</h2>
        <p className="members-count">{users.length} people waiting to meet you</p>

        {error && <div className="error-message">{error}</div>}

        {users.length === 0 && !error ? (
          <div className="no-members">
            <div className="empty-state">
              <span className="empty-icon">🌱</span>
              <p>No other members yet. Be the first to grow this community!</p>
            </div>
          </div>
        ) : (
          <div className="members-grid">
            {users.map((member) => (
              <div key={member._id} className="member-card">
                <div className="member-image-wrapper">
                  <img
                    src={getProfilePictureUrl(member.profilePicture)}
                    alt={member.name}
                    className="member-image"
                  />
                </div>
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-details">{member.age} • {member.gender}</p>
                  <p className="member-bio">{member.bio || 'No bio yet'}</p>
                  <Link to={`/chat/${member._id}`} className="message-btn">
                    Say Hello
                  </Link>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Dashboard;