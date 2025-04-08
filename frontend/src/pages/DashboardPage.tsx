// frontend/src/pages/DashboardPage.tsx
import React from 'react';
import { useNavigate } from 'react-router-dom';
import TransactionList from '../components/TransactionList';
import { logout } from '../services/api'; // Import logout helper

const DashboardPage: React.FC = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    logout(); // Clear token from localStorage
    navigate('/login'); // Redirect to login
  };

  return (
    <div className="dashboard-page">
      <h2>Dashboard</h2>
      <button onClick={handleLogout} style={{ marginBottom: '20px' }}>Logout</button>
      <TransactionList />
      {/* Add Transaction Form component could go here */}
    </div>
  );
};

export default DashboardPage;