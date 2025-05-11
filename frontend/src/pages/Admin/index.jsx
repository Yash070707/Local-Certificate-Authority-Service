import React, { useState, useEffect } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { getPendingCSRs, getAllCSRs, approveCSR, rejectCSR } from '../../api/adminApi';
import { fetchAdminDashboard } from '../../api/dashboard';
import './Admin.css';

const AdminDashboard = () => {
  const { user } = useAuth();
  const [pendingCSRs, setPendingCSRs] = useState([]);
  const [historyCSRs, setHistoryCSRs] = useState([]);
  const [dashboardStats, setDashboardStats] = useState(null);
  const [error, setError] = useState('');

  const fetchPendingCSRs = async () => {
    try {
      const response = await getPendingCSRs();
      if (response.success) {
        setPendingCSRs(response.data);
        setError('');
      } else {
        setError('Failed to fetch pending CSRs');
      }
    } catch (err) {
      console.error('Error fetching pending CSRs:', err);
      setError('Error fetching pending CSRs');
    }
  };

  const fetchHistoryCSRs = async () => {
    try {
      const response = await getAllCSRs();
      if (response.success) {
        const history = response.data.filter(csr => csr.status !== 'pending');
        setHistoryCSRs(history);
        setError('');
      } else {
        setError('Failed to fetch history CSRs');
      }
    } catch (err) {
      console.error('Error fetching history CSRs:', err);
      setError('Error fetching history CSRs');
    }
  };

  const fetchStats = async () => {
    try {
      const data = await fetchAdminDashboard();
      if (data) {
        setDashboardStats(data);
        setError('');
      } else {
        setError('Failed to fetch dashboard stats');
      }
    } catch (err) {
      console.error('Error fetching admin dashboard:', err);
      setError('Error fetching dashboard stats');
    }
  };

  useEffect(() => {
    fetchPendingCSRs();
    fetchHistoryCSRs();
    fetchStats();
  }, []);

  const handleApprove = async (csrId) => {
    try {
      const response = await approveCSR(csrId);
      if (response.success) {
        await Promise.all([fetchPendingCSRs(), fetchHistoryCSRs(), fetchStats()]);
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
        await Promise.all([fetchPendingCSRs(), fetchHistoryCSRs(), fetchStats()]);
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
      <h1>Welcome, Admin {user?.username || 'Admin'}!</h1>
      {error && <div className="error-message">{error}</div>}

      {/* Dashboard Stats */}
      {dashboardStats ? (
        <div className="dashboard-stats">
          <h2>Dashboard Statistics</h2>
          <p>Pending CSRs: {dashboardStats.pending_csrs || 0}</p>
          <p>Active Certificates: {dashboardStats.active_certs || 0}</p>
          <p>Total Users: {dashboardStats.total_users || 0}</p>
        </div>
      ) : (
        <p>Loading dashboard stats...</p>
      )}

      {/* Pending CSRs */}
      <div className="pending-csrs">
        <h2>Pending CSRs</h2>
        {pendingCSRs.length === 0 ? (
          <p>No pending CSRs</p>
        ) : (
          <table>
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
                  <td>{csr.status}</td>
                  <td>
                    <button onClick={() => handleApprove(csr.id)}>Approve</button>
                    <button
                      onClick={() =>
                        handleReject(csr.id, prompt('Enter rejection reason:') || 'No reason provided')
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
      <div className="history-csrs">
        <h2>History CSRs</h2>
        {historyCSRs.length === 0 ? (
          <p>No history CSRs</p>
        ) : (
          <table>
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
    </div>
  );
};

export default AdminDashboard;