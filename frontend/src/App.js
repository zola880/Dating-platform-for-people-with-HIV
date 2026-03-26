import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { SocketProvider } from './context/SocketContext';
import { CallProvider } from './context/CallContext';
import { NotificationProvider } from './context/NotificationContext';
import PrivateRoute from './components/PrivateRoute';
import AdminRoute from './components/admin/AdminRoute';
import AdminSidebar from './components/admin/AdminSidebar';
import VerticalNavbar from './components/VerticalNavbar';
import BottomNav from './components/BottomNav';
import GlobalCallOverlay from './components/GlobalCallOverlay';
import Landing from './pages/Landing';
import Register from './pages/Register';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Profile from './pages/Profile';
import Messages from './pages/Messages';
import Chat from './pages/Chat';
import Feed from './pages/Feed';
// Admin imports
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminUsers from './pages/admin/AdminUsers';
import AdminReports from './pages/admin/AdminReports';
import AdminModeration from './pages/admin/AdminModeration';
import AdminAnnouncements from './pages/admin/AdminAnnouncements';
import AdminLogs from './pages/admin/AdminLogs';
import './App.css';

const AdminLayout = ({ children }) => (
  <div style={{ display: 'flex', minHeight: 'calc(100vh - 70px)' }}>
    <AdminSidebar />
    <div style={{ flex: 1, overflow: 'auto' }}>
      {children}
    </div>
  </div>
);

function App() {
  return (
    <AuthProvider>
      <SocketProvider>
        <NotificationProvider>
          <Router>
            <CallProvider>  {/* Now inside Router */}
              <VerticalNavbar />
              <div className="main-content">
                <div className="container">
                  <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<Landing />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />

                    {/* Protected User Routes */}
                    <Route
                      path="/feed"
                      element={
                        <PrivateRoute>
                          <Feed />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/dashboard"
                      element={
                        <PrivateRoute>
                          <Dashboard />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/profile"
                      element={
                        <PrivateRoute>
                          <Profile />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/messages"
                      element={
                        <PrivateRoute>
                          <Messages />
                        </PrivateRoute>
                      }
                    />
                    <Route
                      path="/chat/:userId"
                      element={
                        <PrivateRoute>
                          <Chat />
                        </PrivateRoute>
                      }
                    />

                    {/* Admin Routes */}
                    <Route
                      path="/admin"
                      element={
                        <AdminRoute>
                          <AdminLayout>
                            <AdminDashboard />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/users"
                      element={
                        <AdminRoute>
                          <AdminLayout>
                            <AdminUsers />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/reports"
                      element={
                        <AdminRoute>
                          <AdminLayout>
                            <AdminReports />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/moderation"
                      element={
                        <AdminRoute>
                          <AdminLayout>
                            <AdminModeration />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/announcements"
                      element={
                        <AdminRoute>
                          <AdminLayout>
                            <AdminAnnouncements />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />
                    <Route
                      path="/admin/logs"
                      element={
                        <AdminRoute requireSuperAdmin={true}>
                          <AdminLayout>
                            <AdminLogs />
                          </AdminLayout>
                        </AdminRoute>
                      }
                    />

                    {/* Catch all */}
                    <Route path="*" element={<Navigate to="/" />} />
                  </Routes>
                </div>
                <BottomNav />
              </div>
              <GlobalCallOverlay />
            </CallProvider>
          </Router>
        </NotificationProvider>
      </SocketProvider>
    </AuthProvider>
  );
}

export default App;