import React, { useState, useEffect } from 'react';
import { getAllUsers, updateUserStatus, deleteUser, assignRole } from '../../utils/adminApi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import './AdminUsers.css';

const AdminUsers = () => {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ status: '', role: '', search: '' });
  const [selectedUser, setSelectedUser] = useState(null);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, [filters]);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const response = await getAllUsers(filters);
      setUsers(response.data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to load users');
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (userId, status) => {
    if (!window.confirm(`Are you sure you want to ${status} this user?`)) return;
    try {
      await updateUserStatus(userId, status);
      fetchUsers();
    } catch (error) {
      console.error('Error updating status:', error);
      alert('Failed to update user status');
    }
  };

  const handleDeleteUser = async (userId) => {
    if (!window.confirm('⚠️ WARNING: This will permanently delete the user and all their data. This cannot be undone. Are you sure?')) return;
    try {
      await deleteUser(userId);
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
      alert('Failed to delete user');
    }
  };

  const handleRoleChange = async (userId, role) => {
    if (!window.confirm(`Assign ${role} role to this user?`)) return;
    try {
      await assignRole(userId, role);
      fetchUsers();
    } catch (error) {
      console.error('Error assigning role:', error);
      alert('Failed to assign role');
    }
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-users">
      <div className="admin-header">
        <h1>User Management</h1>
        <p>Manage all users, suspend accounts, and assign roles</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-bar">
        <input
          type="text"
          placeholder="Search by name or email..."
          value={filters.search}
          onChange={(e) => setFilters({ ...filters, search: e.target.value })}
          className="search-input"
        />
        <select
          value={filters.status}
          onChange={(e) => setFilters({ ...filters, status: e.target.value })}
          className="filter-select"
        >
          <option value="">All Status</option>
          <option value="active">Active</option>
          <option value="suspended">Suspended</option>
          <option value="banned">Banned</option>
        </select>
        <select
          value={filters.role}
          onChange={(e) => setFilters({ ...filters, role: e.target.value })}
          className="filter-select"
        >
          <option value="">All Roles</option>
          <option value="user">User</option>
          <option value="moderator">Moderator</option>
          <option value="admin">Admin</option>
          <option value="superadmin">Super Admin</option>
        </select>
      </div>

      <div className="users-table-container">
        <table className="users-table">
          <thead>
            <tr>
              <th>User</th>
              <th>Email</th>
              <th>Role</th>
              <th>Status</th>
              <th>Joined</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr key={user._id}>
                <td>
                  <div className="user-cell">
                    <img
                      src={user.profilePicture ? `http://localhost:5001/uploads/${user.profilePicture}` : '/default-avatar.png'}
                      alt={user.name}
                      className="user-avatar-small"
                    />
                    <span>{user.name}</span>
                  </div>
                </td>
                <td>{user.email}</td>
                <td>
                  <select
                    value={user.role}
                    onChange={(e) => handleRoleChange(user._id, e.target.value)}
                    className="role-select"
                    disabled={user._id === currentUser._id}
                  >
                    <option value="user">User</option>
                    <option value="moderator">Moderator</option>
                    <option value="admin">Admin</option>
                    <option value="superadmin">Super Admin</option>
                  </select>
                </td>
                <td>
                  <span className={`status-badge ${user.status}`}>{user.status}</span>
                </td>
                <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className="action-buttons">
                    {user.status === 'active' && (
                      <button
                        onClick={() => handleStatusChange(user._id, 'suspended')}
                        className="btn-suspend"
                        disabled={user._id === currentUser._id}
                      >
                        Suspend
                      </button>
                    )}
                    {user.status === 'suspended' && (
                      <button
                        onClick={() => handleStatusChange(user._id, 'active')}
                        className="btn-activate"
                      >
                        Activate
                      </button>
                    )}
                    {user.status !== 'banned' && (
                      <button
                        onClick={() => handleStatusChange(user._id, 'banned')}
                        className="btn-ban"
                        disabled={user._id === currentUser._id}
                      >
                        Ban
                      </button>
                    )}
                    {user.status === 'banned' && (
                      <button
                        onClick={() => handleStatusChange(user._id, 'active')}
                        className="btn-activate"
                      >
                        Unban
                      </button>
                    )}
                    <button
                      onClick={() => handleDeleteUser(user._id)}
                      className="btn-delete"
                      disabled={user._id === currentUser._id}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default AdminUsers;