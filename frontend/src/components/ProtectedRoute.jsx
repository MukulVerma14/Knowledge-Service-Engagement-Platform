import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children, allowedRole }) => {
  const { auth } = useAuth();

  if (!auth.token) {
    return <Navigate to="/login" replace />;
  }

  if (allowedRole && auth.role !== allowedRole) {
    // Redirect to their correct dashboard
    if (auth.role === 'CAMPUS') {
      return <Navigate to="/campus/dashboard" replace />;
    } else if (auth.role === 'CORPORATE') {
      return <Navigate to="/corporate/dashboard" replace />;
    } else if (auth.role === 'SUPER_ADMIN') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;
