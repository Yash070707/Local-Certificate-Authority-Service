import React, { useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import CSRForm from '../../components/CSRForm';
import { submitCSR } from '../../api/certificateApi';
import './User.css';

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
      <header className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Certificate Request Management</p>
      </header>

      <div className="dashboard-content">
        {successMessage && <div className="success-banner">{successMessage}</div>}
        
        <section className="csr-section">
          <h2>New Certificate Request</h2>
          <CSRForm onSubmit={handleCSRSubmit} />
        </section>

        <section className="requests-section">
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
      </div>
    </div>
  );
};

export default UserDashboard;