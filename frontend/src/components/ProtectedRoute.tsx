// frontend/src/components/ProtectedRoute.tsx
import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

interface ProtectedRouteProps {
  // Optional: Add any other props you might need, like required roles
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = () => {
  const token = localStorage.getItem('authToken'); // Check if token exists

  // If no token, redirect to login page
  if (!token) {
    // You can pass the intended location to redirect back after login
    return <Navigate to="/login" replace />;
  }

  // If token exists, render the child route components
  return <Outlet />;
};

export default ProtectedRoute;