import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute: React.FC = () => {
  const token = localStorage.getItem('authToken');

  // Redirect to login if no token
  if (!token) return <Navigate to="/login" replace />;

  // Render child components if token exists
  return <Outlet />;
};

export default ProtectedRoute;
