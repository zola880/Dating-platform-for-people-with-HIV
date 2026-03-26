import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import Spinner from '../Spinner';

const AdminRoute = ({ children, requireSuperAdmin = false }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <Spinner />;
  }

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (user.role !== 'admin' && user.role !== 'superadmin') {
    return <Navigate to="/dashboard" />;
  }

  if (requireSuperAdmin && user.role !== 'superadmin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

export default AdminRoute;