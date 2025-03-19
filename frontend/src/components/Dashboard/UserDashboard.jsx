import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CSRForm from '../../components/CSRForm';
import { submitCSR } from '../../api/certificateApi';
import { Link } from 'react-router-dom';
import './UserDashboard.css';

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState('');

  const handleCSRSubmit = async (csrData) => {
    try {
      const response = await submitCSR(csrData, token);
      setRequests([...requests, response]);
      setSuccessMessage('CSR submitted successfully! Check your email for updates.');
      setTimeout(() => setSuccessMessage(''), 3000);
    } catch (error) {
      console.error('CSR submission failed:', error);
    }
  };

  return (
    <div className="user-dashboard">
      <nav className="navbar">
        <ul>
          <li><Link to="/generate-csr">Generate CSR</Link></li>
          <li><a href="#user-dashboard">User Dashboard</a></li>
          <li><a href="#analytics">Analytics</a></li>
        </ul>
      </nav>

      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Certificate Request Management</p>
      </header>

      <div className="dashboard-content">
        {successMessage && <div className="success-banner">{successMessage}</div>}
        
        <section id="generate-csr" className="csr-section">
          <h2>New Certificate Request</h2>
          <CSRForm onSubmit={handleCSRSubmit} />
        </section>

        <section id="user-dashboard" className="requests-section">
          <h3>Pending Requests</h3>
          <div className="requests-list">
            {requests.map((request, index) => (
              <div key={index} className="request-item">
                <span>{request.commonName}</span>
                <span>{request.status}</span>
              </div>
            ))}
          </div>
        </section>

        <section id="analytics" className="analytics-section">
          <h3>Analytics</h3>
          {/* Add analytics */}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;