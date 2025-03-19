/* eslint-disable no-unused-vars */
import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingCSRs, manageCertificate } from '../../api/adminApi';
import './Admin.css';

const AdminDashboard = () => {
  const { token } = useAuth();
  const [csrRequests, setCsrRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);

  useEffect(() => {
    const loadData = async () => {
      try {
        const csrs = await getPendingCSRs(token);
        setCsrRequests(csrs);
        // Load certificates here
      } catch (error) {
        console.error('Error loading data:', error);
      }
    };
    loadData();
  }, [token]);

  const handleAction = async (action, id) => {
    try {
      await manageCertificate(action, id, token);
      setCsrRequests(csrRequests.filter(req => req.id !== id));
    } catch (error) {
      console.error('Action failed:', error);
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Administration Panel</h1>
        <p>Certificate Authority Management</p>
      </header>

      <div className="admin-content">
        <section className="pending-requests">
          <h2>Pending Certificate Requests</h2>
          <div className="requests-grid">
            {csrRequests.map((request) => (
              <div key={request.id} className="request-card">
                <div className="request-info">
                  <h4>{request.commonName}</h4>
                  <p>Organization: {request.organization}</p>
                  <p>Submitted: {new Date(request.createdAt).toLocaleDateString()}</p>
                </div>
                <div className="request-actions">
                  <button onClick={() => handleAction('approve', request.id)}>Approve</button>
                  <button onClick={() => handleAction('reject', request.id)}>Reject</button>
                </div>
              </div>
            ))}
          </div>
        </section>

        <section className="certificate-list">
          <h2>Active Certificates</h2>
          <div className="certificates-grid">
            {certificates.map((cert) => (
              <div key={cert.id} className="certificate-card">
                <h4>{cert.commonName}</h4>
                <p>Expires: {new Date(cert.expiryDate).toLocaleDateString()}</p>
                <button onClick={() => handleAction('revoke', cert.id)}>Revoke</button>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default AdminDashboard;