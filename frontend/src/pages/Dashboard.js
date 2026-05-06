import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import API from '../utils/api';
import config from '../utils/config';
import Spinner from '../components/Spinner';
import './Dashboard.css';

const Dashboard = () => {
  const { user } = useAuth();
  const [users, setUsers] = useState([]);
  const [recommendations, setRecommendations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchUsers();
    fetchRecommendations();
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

  const fetchRecommendations = async () => {
    try {
      const response = await API.get('/recommendations');
      setRecommendations(response.data);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
      // Non‑critical, so we don't show error to user
    }
  };

  const getProfilePictureUrl = (profilePicture) => {
    if (profilePicture && profilePicture !== 'default-avatar.png') {
      return config.getUploadUrl(profilePicture);
    }
    return '/default-avatar.png';
  };

  if (loading) {
    return <Spinner />;
  }

  return (
    <div className="dashboard">
      <div className="dashboard-header">
        <div className="welcome-section">
          <h1>Welcome, {user?.name}!</h1>
          <p>Connect with others in the Safe Connect community</p>
        </div>
        <div className="profile-summary">
          <img
            src={getProfilePictureUrl(user?.profilePicture)}
            alt={user?.name}
            className="profile-summary-image"
          />
          <div className="profile-summary-info">
            <h3>{user?.name}</h3>
            <p>{user?.age} years old • {user?.gender}</p>
            <Link to="/profile" className="edit-profile-btn">Edit Profile</Link>
          </div>
        </div>
      </div>

      {/* Recommendations Section */}
      {recommendations.length > 0 && (
        <div className="members-section recommendations-section">
          <h2>✨ Recommended for you</h2>
          <p className="members-count">Based on your interests and preferences</p>
          <div className="members-grid">
            {recommendations.map((member) => (
              <div key={member._id} className="member-card">
                <img
                  src={getProfilePictureUrl(member.profilePicture)}
                  alt={member.name}
                  className="member-image"
                />
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-details">{member.age} years • {member.gender}</p>
                  <p className="member-bio">{member.bio || 'No bio yet'}</p>
                  <Link to={`/chat/${member._id}`} className="message-btn">
                    Send Message
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* All Members Section */}
      <div className="members-section">
        <h2>Community Members</h2>
        <p className="members-count">{users.length} members available to connect</p>

        {error && <div className="error-message">{error}</div>}

        {users.length === 0 && !error ? (
          <div className="no-members">
            <p>No other members found yet. Check back later!</p>
          </div>
        ) : (
          <div className="members-grid">
            {users.map((member) => (
              <div key={member._id} className="member-card">
                <img
                  src={getProfilePictureUrl(member.profilePicture)}
                  alt={member.name}
                  className="member-image"
                />
                <div className="member-info">
                  <h3>{member.name}</h3>
                  <p className="member-details">{member.age} years • {member.gender}</p>
                  <p className="member-bio">{member.bio || 'No bio yet'}</p>
                  <Link to={`/chat/${member._id}`} className="message-btn">
                    Send Message
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