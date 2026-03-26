import React, { useState, useEffect } from 'react';
import { getReports, resolveReport } from '../../utils/adminApi';
import Spinner from '../../components/Spinner';
import './AdminReports.css';

const AdminReports = () => {
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [filters, setFilters] = useState({ resolved: 'false', type: '' });
  const [selectedReport, setSelectedReport] = useState(null);
  const [actionModal, setActionModal] = useState(false);
  const [actionTaken, setActionTaken] = useState('');

  useEffect(() => {
    fetchReports();
  }, [filters]);

  const fetchReports = async () => {
    try {
      setLoading(true);
      const response = await getReports(filters);
      setReports(response.data.reports);
    } catch (error) {
      console.error('Error fetching reports:', error);
      setError('Failed to load reports');
    } finally {
      setLoading(false);
    }
  };

  const handleResolve = async (reportId) => {
    if (!actionTaken.trim()) {
      alert('Please describe the action taken');
      return;
    }
    try {
      await resolveReport(reportId, actionTaken);
      setActionModal(false);
      setSelectedReport(null);
      setActionTaken('');
      fetchReports();
    } catch (error) {
      console.error('Error resolving report:', error);
      alert('Failed to resolve report');
    }
  };

  const getTypeIcon = (type) => {
    const icons = {
      user: '👤',
      post: '📝',
      comment: '💬',
      message: '✉️'
    };
    return icons[type] || '🚩';
  };

  const getTypeColor = (type) => {
    const colors = {
      user: '#9b59b6',
      post: '#3498db',
      comment: '#e67e22',
      message: '#1abc9c'
    };
    return colors[type] || '#7A8B9F';
  };

  if (loading) return <Spinner />;

  return (
    <div className="admin-reports">
      <div className="admin-header">
        <h1>Reports Management</h1>
        <p>Review and handle user reports for inappropriate content</p>
      </div>

      {error && <div className="error-message">{error}</div>}

      <div className="filters-bar">
        <select
          value={filters.resolved}
          onChange={(e) => setFilters({ ...filters, resolved: e.target.value })}
          className="filter-select"
        >
          <option value="false">Pending Reports</option>
          <option value="true">Resolved Reports</option>
          <option value="">All Reports</option>
        </select>
        <select
          value={filters.type}
          onChange={(e) => setFilters({ ...filters, type: e.target.value })}
          className="filter-select"
        >
          <option value="">All Types</option>
          <option value="user">User Reports</option>
          <option value="post">Post Reports</option>
          <option value="comment">Comment Reports</option>
          <option value="message">Message Reports</option>
        </select>
      </div>

      <div className="reports-grid">
        {reports.length === 0 ? (
          <div className="no-reports">
            <div className="empty-state">
              <span className="empty-icon">✅</span>
              <p>No reports to review</p>
            </div>
          </div>
        ) : (
          reports.map((report) => (
            <div key={report._id} className={`report-card ${report.resolved ? 'resolved' : 'pending'}`}>
              <div className="report-header">
                <div className="report-type" style={{ backgroundColor: getTypeColor(report.type) }}>
                  {getTypeIcon(report.type)} {report.type}
                </div>
                <div className="report-status">
                  {report.resolved ? '✅ Resolved' : '⚠️ Pending'}
                </div>
              </div>
              <div className="report-content">
                <p className="report-reason"><strong>Reason:</strong> {report.reason}</p>
                {report.description && (
                  <p className="report-description"><strong>Details:</strong> {report.description}</p>
                )}
                <div className="report-meta">
                  <span>Reported by: <strong>{report.reportedBy?.name}</strong></span>
                  <span>Date: {new Date(report.createdAt).toLocaleString()}</span>
                </div>
                {report.targetUser && (
                  <div className="report-target">
                    <strong>Target User:</strong> {report.targetUser.name} ({report.targetUser.email})
                  </div>
                )}
              </div>
              {!report.resolved && (
                <div className="report-actions">
                  <button
                    className="btn-resolve"
                    onClick={() => {
                      setSelectedReport(report);
                      setActionModal(true);
                    }}
                  >
                    Resolve Report
                  </button>
                </div>
              )}
              {report.resolved && report.actionTaken && (
                <div className="report-resolution">
                  <strong>Action Taken:</strong> {report.actionTaken}
                  <br />
                  <small>Resolved by: {report.resolvedBy?.name}</small>
                </div>
              )}
            </div>
          ))
        )}
      </div>

      {/* Resolution Modal */}
      {actionModal && selectedReport && (
        <div className="modal-overlay" onClick={() => setActionModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h3>Resolve Report</h3>
            <p><strong>Report Type:</strong> {selectedReport.type}</p>
            <p><strong>Reason:</strong> {selectedReport.reason}</p>
            <div className="form-group">
              <label>Action Taken</label>
              <textarea
                placeholder="Describe what action was taken (e.g., warned user, deleted content, suspended account)"
                value={actionTaken}
                onChange={(e) => setActionTaken(e.target.value)}
                rows="4"
              />
            </div>
            <div className="modal-actions">
              <button className="btn-cancel" onClick={() => setActionModal(false)}>Cancel</button>
              <button className="btn-submit" onClick={() => handleResolve(selectedReport._id)}>Submit Resolution</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminReports;