import React, { useState, useEffect } from 'react';
import { healthAPI } from '../services/api';

const Home = () => {
  const [healthStatus, setHealthStatus] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    checkHealth();
  }, []);

  const checkHealth = async () => {
    try {
      setLoading(true);
      const response = await healthAPI.getHealth();
      setHealthStatus(response.data);
    } catch (error) {
      setHealthStatus({ status: 'error', message: 'Backend not available' });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <div className="card">
        <h2>Welcome to Fullstack CI/CD Boilerplate</h2>
        <p>
          This is a demonstration of a modern fullstack application with:
        </p>
        <ul style={{ textAlign: 'left', maxWidth: '600px', margin: '0 auto' }}>
          <li><strong>Frontend:</strong> React with Redux Toolkit</li>
          <li><strong>Backend:</strong> Node.js with Express</li>
          <li><strong>Database:</strong> PostgreSQL</li>
          <li><strong>Containerization:</strong> Docker & Docker Compose</li>
          <li><strong>CI/CD:</strong> GitHub Actions</li>
          <li><strong>Infrastructure:</strong> AWS ECS Fargate with CloudFormation</li>
        </ul>
      </div>

      <div className="card">
        <h3>Backend Health Status</h3>
        {loading ? (
          <div className="loading">Checking backend health...</div>
        ) : (
          <div>
            <div className={healthStatus?.status === 'ok' ? 'success' : 'error'}>
              Status: {healthStatus?.status || 'Unknown'}
              {healthStatus?.message && <div>{healthStatus.message}</div>}
              {healthStatus?.timestamp && (
                <div>Last checked: {new Date(healthStatus.timestamp).toLocaleString()}</div>
              )}
            </div>
            <button className="button" onClick={checkHealth}>
              Refresh Health Check
            </button>
          </div>
        )}
      </div>

      <div className="card">
        <h3>Getting Started</h3>
        <p>Navigate to the <strong>Users</strong> page to see the CRUD operations in action.</p>
        <p>The application demonstrates:</p>
        <ul style={{ textAlign: 'left', maxWidth: '500px', margin: '0 auto' }}>
          <li>API communication between frontend and backend</li>
          <li>State management with Redux</li>
          <li>Database operations with PostgreSQL</li>
          <li>Containerized development environment</li>
        </ul>
      </div>
    </div>
  );
};

export default Home;
