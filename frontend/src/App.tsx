// frontend/src/App.tsx
import { useState, useEffect } from 'react';
import './App.css';
import { getHealth } from './services/api'; // Import our API function

function App() {
  const [backendStatus, setBackendStatus] = useState<string>('Checking...');
  const [error, setError] = useState<string | null>(null);

  // Fetch health status when the component mounts
  useEffect(() => {
    getHealth()
      .then(data => {
        setBackendStatus(`Backend is ${data.status} (Timestamp: ${data.timestamp})`);
        setError(null); // Clear previous errors
      })
      .catch(err => {
        console.error(err);
        // Attempt to get a more specific error message
        let message = 'Failed to connect to backend.';
        if (err.response) {
            // Request made and server responded
            message = `Backend error: ${err.response.status} - ${err.response.data?.message || err.message}`;
        } else if (err.request) {
            // Request was made but no response received
            message = 'No response from backend. Is it running?';
        } else {
            // Something else happened
            message = `Error: ${err.message}`;
        }
        setBackendStatus('Error');
        setError(message);
      });
  }, []); // Empty dependency array means run only once on mount

  return (
    <>
      <h1>Finance Tracker Frontend</h1>
      <div className="card">
        <h2>Backend Status</h2>
        <p>{backendStatus}</p>
        {error && <p style={{ color: 'red' }}>{error}</p>}
      </div>

      {/* We will add Routing and Pages/Components here later */}
    </>
  );
}

export default App;