import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingCSRs, getAllCSRs, approveCSR, rejectCSR } from '../../api/adminApi';
import { fetchAdminDashboard } from '../../api/dashboard';
import './Admin.css';

// Icons (from UserDashboard.jsx for consistency)
const ShieldCheck = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
);

const Shield = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
);

const CheckCircle = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
);

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingCSRs, setPendingCSRs] = useState([]);
  const [historyCSRs, setHistoryCSRs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(true);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [pendingResponse, allResponse, statsData] = await Promise.all([
        getPendingCSRs(),
        getAllCSRs(),
        fetchAdminDashboard(),
      ]);

      if (pendingResponse.success) {
        setPendingCSRs(pendingResponse.data);
      } else {
        setError('Failed to fetch pending CSRs');
      }

      if (allResponse.success) {
        const history = allResponse.data.filter(csr => csr.status !== 'pending');
        setHistoryCSRs(history);
      } else {
        setError('Failed to fetch history CSRs');
      }

      if (statsData) {
        setDashboardStats(statsData);
      } else {
        setError('Failed to fetch dashboard stats');
      }

      setError('');
    } catch (err) {
      console.error('Error fetching admin dashboard data:', err);
      setError('Error fetching dashboard data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();

    // Polling for updates (every 5 minutes)
    const pollInterval = setInterval(fetchData, 300000);
    return () => clearInterval(pollInterval);
  }, []);

  const handleApprove = async (csrId) => {
    try {
      const response = await approveCSR(csrId);
      if (response.success) {
        await fetchData();
        setError('');
      } else {
        setError(response.message || 'Failed to approve CSR');
      }
    } catch (err) {
      console.error('Error approving CSR:', err);
      setError('Error approving CSR');
    }
  };

  const handleReject = async (csrId, reason) => {
    try {
      const response = await rejectCSR(csrId, reason);
      if (response.success) {
        await fetchData();
        setError('');
      } else {
        setError(response.message || 'Failed to reject CSR');
      }
    } catch (err) {
      console.error('Error rejecting CSR:', err);
      setError('Error rejecting CSR');
    }
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <div className="header-content">
          <div className="logo-container">
            <ShieldCheck className="logo-icon" />
            <span className="logo-text">CA Service - Admin</span>
          </div>
          <div className="user-info">
            <span>Welcome, {user?.username || 'Admin'}</span>
          </div>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="dashboard-welcome">
          <div className="welcome-text">
            <h1>Admin Dashboard</h1>
            <p>Manage all certificate signing requests and certificates</p>
            {error && (
              <div className="error-message">
                <span>{error}</span>
              </div>
            )}
          </div>
        </div>

        {/* Dashboard Stats */}
        {loading ? (
          <p>Loading dashboard stats...</p>
        ) : dashboardStats ? (
          <div className="dashboard-stats">
            <h2>System Statistics</h2>
            <div className="stat-card">
              <div className="stat-header">
                <h3>Total CSRs</h3>
                <Shield className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dashboardStats.total_csrs}</div>
                <p className="stat-description">All CSR requests</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <h3>Pending CSRs</h3>
                <Shield className="stat-icon" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dashboardStats.pending_csrs}</div>
                <p className="stat-description">Awaiting approval</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <h3>Approved CSRs</h3>
                <ShieldCheck className="stat-icon active" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dashboardStats.approved_csrs}</div>
                <p className="stat-description">Certificates issued</p>
              </div>
            </div>
            <div className="stat-card">
              <div className="stat-header">
                <h3>Active Certificates</h3>
                <ShieldCheck className="stat-icon active" />
              </div>
              <div className="stat-content">
                <div className="stat-value">{dashboardStats.active_certs}</div>
                <p className="stat-description">Valid certificates</p>
              </div>
            </div>
          </div>
        ) : (
          <p>No dashboard stats available</p>
        )}

        {/* Pending CSRs */}
        <div className="pending-csrs certificate-table-container">
          <div className="table-header">
            <h2>Pending CSRs</h2>
            <p>Review and manage pending certificate signing requests</p>
          </div>
          {loading ? (
            <p>Loading pending CSRs...</p>
          ) : pendingCSRs.length === 0 ? (
            <p className="empty-table">No pending CSRs</p>
          ) : (
            <table className="certificate-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {pendingCSRs.map((csr) => (
                  <tr key={csr.id}>
                    <td>{csr.domain}</td>
                    <td>{csr.username}</td>
                    <td>{csr.email}</td>
                    <td>{csr.status.charAt(0).toUpperCase() + csr.status.slice(1)}</td>
                    <td>
                      <button
                        className="action-button approve"
                        onClick={() => handleApprove(csr.id)}
                      >
                        Approve
                      </button>
                      <button
                        className="action-button reject"
                        onClick={() =>
                          handleReject(
                            csr.id,
                            prompt('Enter rejection reason:') || 'No reason provided'
                          )
                        }
                      >
                        Reject
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* History CSRs */}
        <div className="history-csrs certificate-table-container">
          <div className="table-header">
            <h2>History CSRs</h2>
            <p>View all processed certificate signing requests</p>
          </div>
          {loading ? (
            <p>Loading history CSRs...</p>
          ) : historyCSRs.length === 0 ? (
            <p className="empty-table">No history CSRs</p>
          ) : (
            <table className="certificate-table">
              <thead>
                <tr>
                  <th>Domain</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Status</th>
                </tr>
              </thead>
              <tbody>
                {historyCSRs.map((csr) => (
                  <tr key={csr.id}>
                    <td>{csr.domain}</td>
                    <td>{csr.username}</td>
                    <td>{csr.email}</td>
                    <td
                      style={{
                        color: csr.status === 'rejected' ? 'red' : 'green',
                      }}
                    >
                      {csr.status.charAt(0).toUpperCase() + csr.status.slice(1)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;