import React, { useEffect, useState } from 'react';
import { useAuth } from '../../contexts/AuthContext';
import { 
  getPendingCSRs, 
  getAllCertificates,
  approveCSR, 
  rejectCSR,
  revokeCertificate 
} from '../../api/adminApi';
import './Admin.css';

const CheckCircle = () => <span>✓</span>;
const AlertCircle = () => <span>!</span>;
const Clock = () => <span>🕒</span>;
const ShieldOff = () => <span>🛡️</span>;

const AdminDashboard = () => {
  const { user } = useAuth();
  const [csrRequests, setCsrRequests] = useState([]);
  const [certificates, setCertificates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('requests');
  const [actionLoading, setActionLoading] = useState({
    approve: null,
    reject: null,
    revoke: null,
  });

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [pendingRequests, issuedCerts] = await Promise.all([
          getPendingCSRs(),
          getAllCertificates(),
        ]);
        
        setCsrRequests(pendingRequests.data || []);
        setCertificates(issuedCerts.data || []);
      } catch (error) {
        console.error('Error loading admin data:', error);
      } finally {
        setLoading(false);
      }
    };
    
    loadData();
  }, []);

  const handleApprove = async (id) => {
    try {
      setActionLoading({ ...actionLoading, approve: id });
      const response = await approveCSR(id);
      if (response.success) {
        setCsrRequests(csrRequests.filter(req => req.id !== id));
        setCertificates([...certificates, response.certificate]);
      }
    } catch (error) {
      console.error('Approval failed:', error);
    } finally {
      setActionLoading({ ...actionLoading, approve: null });
    }
  };

  const handleReject = async (id) => {
    try {
      setActionLoading({ ...actionLoading, reject: id });
      const response = await rejectCSR(id);
      if (response.success) {
        setCsrRequests(csrRequests.filter(req => req.id !== id));
      }
    } catch (error) {
      console.error('Rejection failed:', error);
    } finally {
      setActionLoading({ ...actionLoading, reject: null });
    }
  };

  const handleRevoke = async (id) => {
    try {
      setActionLoading({ ...actionLoading, revoke: id });
      const response = await revokeCertificate(id);
      if (response.success) {
        setCertificates(certificates.map(cert => 
          cert.id === id ? { ...cert, status: 'revoked' } : cert
        ));
      }
    } catch (error) {
      console.error('Revocation failed:', error);
    } finally {
      setActionLoading({ ...actionLoading, revoke: null });
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  return (
    <div className="admin-dashboard">
      <header className="dashboard-header">
        <h1>Certificate Authority Admin Dashboard</h1>
        <p>Welcome, {user?.username || 'Admin'}</p>
      </header>

      <div className="tabs">
        <button 
          className={`tab-button ${activeTab === 'requests' ? 'active' : ''}`}
          onClick={() => setActiveTab('requests')}
        >
          Pending Requests ({csrRequests.length})
        </button>
        <button 
          className={`tab-button ${activeTab === 'certificates' ? 'active' : ''}`}
          onClick={() => setActiveTab('certificates')}
        >
          Managed Certificates ({certificates.length})
        </button>
      </div>

      <div className="admin-content">
        {loading ? (
          <div className="loading">Loading dashboard data...</div>
        ) : activeTab === 'requests' ? (
          <section className="pending-requests">
            <h2>Pending Certificate Requests</h2>
            {csrRequests.length === 0 ? (
              <div className="empty-state">No pending certificate requests</div>
            ) : (
              <div className="requests-grid">
                {csrRequests.map((request) => (
                  <div key={request.id} className="request-card">
                    <div className="request-info">
                      <h4>{request.domain}</h4>
                      <p><strong>Organization:</strong> {request.company}</p>
                      <p><strong>Requested by:</strong> {request.username || request.email}</p>
                      <p><strong>Submitted:</strong> {formatDate(request.created_at)}</p>
                      <div className="status-badge pending">
                        <Clock className="badge-icon" />
                        Pending Approval
                      </div>
                    </div>
                    <div className="request-actions">
                      <button 
                        onClick={() => handleApprove(request.id)}
                        disabled={actionLoading.approve === request.id}
                      >
                        {actionLoading.approve === request.id ? 'Approving...' : 'Approve'}
                      </button>
                      <button 
                        onClick={() => handleReject(request.id)}
                        disabled={actionLoading.reject === request.id}
                      >
                        {actionLoading.reject === request.id ? 'Rejecting...' : 'Reject'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </section>
        ) : (
          <section className="certificate-list">
            <h2>Managed Certificates</h2>
            {certificates.length === 0 ? (
              <div className="empty-state">No certificates issued yet</div>
            ) : (
              <div className="certificates-grid">
                {certificates.map((cert) => (
                  <div key={cert.id} className="certificate-card">
                    <div className="certificate-info">
                      <h4>{cert.domain}</h4>
                      <p><strong>Issued to:</strong> {cert.username || cert.email}</p>
                      <p><strong>Issued on:</strong> {formatDate(cert.issued_at)}</p>
                      <p><strong>Expires:</strong> {formatDate(cert.valid_till)}</p>
                      <div className={`status-badge ${cert.status === 'revoked' ? 'revoked' : 'approved'}`}>
                        {cert.status === 'revoked' ? (
                          <>
                            <ShieldOff className="badge-icon" />
                            Revoked
                          </>
                        ) : (
                          <>
                            <CheckCircle className="badge-icon" />
                            Active
                          </>
                        )}
                      </div>
                    </div>
                    {cert.status !== 'revoked' && (
                      <button 
                        onClick={() => handleRevoke(cert.id)}
                        disabled={actionLoading.revoke === cert.id}
                      >
                        {actionLoading.revoke === cert.id ? 'Revoking...' : 'Revoke Certificate'}
                      </button>
                    )}
                  </div>
                ))}
              </div>
            )}
          </section>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;