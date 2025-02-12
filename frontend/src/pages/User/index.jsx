import React, { useContext } from 'react';
import CSRForm from '../../components/CSRForm';
import { AuthContext } from '../../contexts/AuthContext';
import './Dashboard.css';

const UserDashboard = () => {
  const { user } = useContext(AuthContext);

  const handleCSRSubmit = async (csrData) => {
    try {
      // API call to submit CSR
      // Show success message and send email
    } catch (error) {
      // Handle error
    }
  };

  return (
    <div className="dashboard-container">
      <div className="dashboard-header">
        <h1>Welcome, {user?.username}</h1>
        <p>Certificate Request Portal</p>
      </div>
      
      <div className="dashboard-content">
        <CSRForm onSubmit={handleCSRSubmit} />
        
        <div className="requests-status">
          <h3>Your Pending Requests</h3>
          {/* List of pending CSRs */}
        </div>
      </div>
    </div>
  );
};

export default UserDashboard;