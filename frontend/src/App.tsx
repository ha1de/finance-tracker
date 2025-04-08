// frontend/src/App.tsx
import React from 'react';
import { Routes, Route, Link, Navigate } from 'react-router-dom';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import ProtectedRoute from './components/ProtectedRoute'; // Import ProtectedRoute
import './App.css';

function App() {

  // Simple check for initial auth state (can be improved with context/state management)
  const isAuthenticated = !!localStorage.getItem('authToken');

  return (
    <>
      {/* Optional: Add a basic navigation header */}
      <nav style={{ marginBottom: '20px', borderBottom: '1px solid #ccc', paddingBottom: '10px' }}>
        <Link to="/" style={{ marginRight: '10px' }}>Dashboard</Link>
        {!isAuthenticated && <Link to="/login" style={{ marginRight: '10px' }}>Login</Link>}
        {!isAuthenticated && <Link to="/register">Register</Link>}
        {/* Logout button is now on DashboardPage */}
      </nav>

      {/* Define application routes */}
      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />

        {/* Protected Routes */}
        <Route element={<ProtectedRoute />}> {/* Wrap protected routes */}
            <Route path="/" element={<DashboardPage />} />
            {/* Add other protected routes here (e.g., /profile, /add-transaction) */}
        </Route>

        {/* Optional: Redirect root path based on auth state (alternative to protected route) */}
        {/* <Route path="/" element={isAuthenticated ? <DashboardPage /> : <Navigate to="/login" />} /> */}

        {/* Optional: Handle 404 Not Found */}
        <Route path="*" element={<h2>Page Not Found</h2>} />
      </Routes>
    </>
  );
}

export default App;