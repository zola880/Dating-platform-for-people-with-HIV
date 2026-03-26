import React, { useState, useEffect } from 'react';
import { getActivityLogs } from '../../utils/adminApi';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../../components/Spinner';
import './AdminLogs.css';

const AdminLogs = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ action: '', page: 1 });
  const [totalPages, setTotalPages] = useState(1);

  useEffect(() => {
    if (user?.role !== 'superadmin') {
      setError('Access denied. Super admin privileges required.');
      setLoading(false);
      return;
    }
    fetchLogs();
  }, [filters]);

  const fetchLogs = async () => {
    try {
      setLoading(true);
      const response = await getActivityLogs(filters);
      setLogs(response.data.logs);
      setTotalPages(response.data.pages);
    } catch (error) {
      console.error('Error fetching logs:', error);
      setError('Failed to load activity logs');
    } finally {
      setLoading(false);
    }
  };

  const getActionIcon = (action) => {
    if (action.includes('User')) return '👤';
    if (action.includes('Post')) return '📝';
    if (action.includes('Comment')) return '💬';
    if (action.includes('Report')) return '🚩';
    if (action.includes('Role')) return '👑';
    if (action.includes('Announcement')) return '📢';
    return '⚙️';
  };

  if (user?.role !== 'superadmin') {
    return (
      <div className="admin-logs">
        <div className="admin-header">
          <h1>Activity Logs</h1>
        </div>
        <div className="error-message">
          Access denied. This page is only available to Super Administrators.
        </div>
      </div>
    );
  }

  if (loading) return <Spinner />;

  return (
    <div className="admin-logs">
      <div className="admin-header">
        <h1>Activity Logs</h1>
        <p>Track all admin actions for accountability and audit</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="logs-filters">
        <input
          type="text"
          placeholder="Filter by action..."
          value={filters.action}
          onChange={(e) => setFilters({ ...filters, action: e.target.value, page: 1 })}
          className="search-input"
        />
      </div>

      <div className="logs-table-container">
        <table className="logs-table">
          <thead>
            <tr>
              <th>Action</th>
              <th>Admin</th>
              <th>Target</th>
              <th>Details</th>
              <th>Date</th>
            </tr>
          </thead>
          <tbody>
            {logs.length === 0 ? (
              <tr>
                <td colSpan="5" className="no-logs">No activity logs found</td>
              </tr>
            ) : (
              logs.map((log) => (
                <tr key={log._id}>
                  <td>
                    <span className="action-icon">{getActionIcon(log.action)}</span>
                    <span className="action-text">{log.action}</span>
                  </td>
                  <td>
                    <div className="admin-info">
                      <strong>{log.admin?.name}</strong>
                      <small>{log.admin?.email}</small>
                    </div>
                  </td>
                  <td>
                    {log.target ? (
                      <div className="target-info">
                        <strong>{log.target.name}</strong>
                        <small>{log.target.email}</small>
                      </div>
                    ) : (
                      <span className="no-target">—</span>
                    )}
                  </td>
                  <td>
                    {log.details ? (
                      <pre className="details-preview">
                        {JSON.stringify(log.details, null, 2)}
                      </pre>
                    ) : (
                      <span className="no-details">—</span>
                    )}
                  </td>
                  <td>
                    <div className="date-info">
                      <strong>{new Date(log.createdAt).toLocaleDateString()}</strong>
                      <small>{new Date(log.createdAt).toLocaleTimeString()}</small>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            onClick={() => setFilters({ ...filters, page: filters.page - 1 })}
            disabled={filters.page === 1}
          >
            Previous
          </button>
          <span>Page {filters.page} of {totalPages}</span>
          <button
            onClick={() => setFilters({ ...filters, page: filters.page + 1 })}
            disabled={filters.page === totalPages}
          >
            Next
          </button>
        </div>
      )}
    </div>
  );
};

export default AdminLogs;