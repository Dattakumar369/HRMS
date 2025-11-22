import React from 'react';
import { Navigate } from 'react-router-dom';
import { getCurrentUser } from '../../utils/dataInitializer';

const ProtectedRoute = ({ children, role }) => {
  const currentUser = getCurrentUser();

  if (!currentUser) {
    return <Navigate to="/login" replace />;
  }

  if (role && currentUser.role !== role) {
    // Redirect to appropriate dashboard based on user role
    if (currentUser.role === 'Admin') {
      return <Navigate to="/admin/dashboard" replace />;
    } else {
      return <Navigate to="/employee/dashboard" replace />;
    }
  }

  return children;
};

export default ProtectedRoute;

