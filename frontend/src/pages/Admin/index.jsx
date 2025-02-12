import React, { useContext, useEffect, useState } from 'react';
import { AuthContext } from '../../contexts/AuthContext';
import AdminActions from '../../components/AdminActions';
import './Dashboard.css';

const AdminDashboard = () => {
  const [csrRequests, setCsrRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const { user } = useContext(AuthContext);

  useEffect(() => {
    // Fetch pending CSRs and active certificates
  }, []);

  const handleApprove = async (csrId) => {
    // Approve CSR logic
  };

  const handleRevoke = async (certificateId) => {
    // Revoke certificate logic
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Admin Dashboard</h1>
        <p>Logged in as: {user?.username}</p>
      </div>

      <div className="admin-sections">
        <div className="pending-requests">
          <h2>Pending CSR Requests ({csrRequests.length})</h2>
          <div className="request-list">
            {csrRequests.map(request => (
              <div key={request.id} className="request-item">
                <span>{request.commonName}</span>
                <button onClick={() => handleApprove(request.id)}>Review</button>
              </div>
            ))}
          </div>
        </div>

        <div className="certificate-management">
          <h2>Active Certificates</h2>
          <div className="certificate-list">
            {certificates.map(cert => (
              <div key={cert.id} className="cert-item">
                <span>{cert.commonName}</span>
                <span>{cert.expiryDate}</span>
                <button onClick={() => handleRevoke(cert.id)}>Revoke</button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;