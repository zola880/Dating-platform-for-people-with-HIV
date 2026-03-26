import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { getDashboardStats } from '../../utils/adminApi';
import Spinner from '../../components/Spinner';
import './AdminDashboard.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const response = await getDashboardStats();
      setStats(response.data);
    } catch (error) {
      console.error('Error fetching stats:', error);
      setError('Failed to load dashboard data');
    } finally {
      setLoading(false);
    }
  };

  if (loading) return <Spinner />;

  const statCards = [
    { title: 'Total Users', value: stats?.users?.total || 0, color: '#FF6B6B', icon: '👥' },
    { title: 'Active Users', value: stats?.users?.active || 0, color: '#4ECDC4', icon: '✅' },
    { title: 'Suspended Users', value: stats?.users?.suspended || 0, color: '#FFE66D', icon: '⚠️' },
    { title: 'Banned Users', value: stats?.users?.banned || 0, color: '#e74c3c', icon: '🚫' },
    { title: 'Total Posts', value: stats?.content?.posts || 0, color: '#9b59b6', icon: '📝' },
    { title: 'Messages', value: stats?.content?.messages || 0, color: '#3498db', icon: '💬' },
    { title: 'Pending Reports', value: stats?.reports?.pending || 0, color: '#e67e22', icon: '🚩' },
  ];

  return (
    <div className="admin-dashboard">
      <div className="admin-header">
        <h1>Welcome back, {user?.name}</h1>
        <p>Here's what's happening on your platform</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="stats-grid">
        {statCards.map((card, idx) => (
          <div key={idx} className="stat-card" style={{ borderTopColor: card.color }}>
            <div className="stat-icon">{card.icon}</div>
            <div className="stat-info">
              <h3>{card.title}</h3>
              <p className="stat-value">{card.value.toLocaleString()}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="recent-section">
        <div className="recent-users">
          <h2>Recent Users</h2>
          <table className="recent-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Email</th>
                <th>Role</th>
                <th>Status</th>
                <th>Joined</th>
              </tr>
            </thead>
            <tbody>
              {stats?.recentUsers?.map((user) => (
                <tr key={user._id}>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td><span className={`role-badge ${user.role}`}>{user.role}</span></td>
                  <td><span className={`status-badge ${user.status}`}>{user.status}</span></td>
                  <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="recent-posts">
          <h2>Recent Posts</h2>
          {stats?.recentPosts?.map((post) => (
            <div key={post._id} className="recent-post">
              <div className="post-user">
                <strong>{post.user?.name}</strong>
                <span>{new Date(post.createdAt).toLocaleString()}</span>
              </div>
              <p className="post-content-preview">{post.content?.substring(0, 100)}...</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;