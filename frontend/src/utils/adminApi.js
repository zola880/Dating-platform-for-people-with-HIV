import API from './api';

// Dashboard Stats
export const getDashboardStats = async () => {
  return await API.get('/admin/stats');
};

// User Management
export const getAllUsers = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return await API.get(`/admin/users?${queryParams}`);
};

export const updateUserStatus = async (userId, status, suspendedUntil, reason) => {
  return await API.put(`/admin/users/${userId}/status`, { status, suspendedUntil, reason });
};

export const deleteUser = async (userId) => {
  return await API.delete(`/admin/users/${userId}`);
};

export const assignRole = async (userId, role) => {
  return await API.put(`/admin/users/${userId}/role`, { role });
};

// Reports
export const getReports = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return await API.get(`/admin/reports?${queryParams}`);
};

export const resolveReport = async (reportId, actionTaken) => {
  return await API.put(`/admin/reports/${reportId}/resolve`, { actionTaken });
};

// Moderation
export const deletePostAdmin = async (postId) => {
  return await API.delete(`/admin/posts/${postId}`);
};

export const deleteCommentAdmin = async (postId, commentId) => {
  return await API.delete(`/admin/posts/${postId}/comments/${commentId}`);
};

// Announcements
export const sendAnnouncement = async (title, message, audience) => {
  return await API.post('/admin/announcements', { title, message, audience });
};

// Activity Logs
export const getActivityLogs = async (params = {}) => {
  const queryParams = new URLSearchParams(params).toString();
  return await API.get(`/admin/logs?${queryParams}`);
};