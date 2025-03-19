import React from 'react';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GppGoodIcon from '@mui/icons-material/GppGood';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section">
        <div className="hero-content">
          <h1 className="hero-title">
            <SecurityIcon className="hero-icon" />
            Local Certificate Authority
          </h1>
          <p className="hero-subtitle">
            Enterprise-grade PKI solution for secure digital certificate management
          </p>
          <div className="cta-buttons">
            <Link to="/login" className="btn primary">
              Get Started
            </Link>
            <Link to="/signup" className="btn secondary">
              Create Account
            </Link>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="features-section">
        <h2 className="section-title">Why Choose Our CA Service?</h2>
        
        <div className="features-grid">
          {/* User Features */}
          <div className="feature-card user-features">
            <div className="feature-header">
              <AssignmentIcon className="feature-icon" />
              <h3>User Features</h3>
            </div>
            <ul className="feature-list">
              <li>
                <GppGoodIcon className="list-icon" />
                <div>
                  <h4>Certificate Generation</h4>
                  <p>Create secure certificate signing requests (CSRs) with automatic validation</p>
                </div>
              </li>
              <li>
                <DownloadIcon className="list-icon" />
                <div>
                  <h4>Request Tracking</h4>
                  <p>Real-time status monitoring of your certificate requests</p>
                </div>
              </li>
              <li>
                <SecurityIcon className="list-icon" />
                <div>
                  <h4>Secure Downloads</h4>
                  <p>Download issued certificates with end-to-end encryption</p>
                </div>
              </li>
            </ul>
          </div>

          {/* Admin Features */}
          <div className="feature-card admin-features">
            <div className="feature-header">
              <AdminPanelSettingsIcon className="feature-icon" />
              <h3>Administration Features</h3>
            </div>
            <ul className="feature-list">
              <li>
                <GppGoodIcon className="list-icon" />
                <div>
                  <h4>CSR Management</h4>
                  <p>Review and approve certificate requests with detailed audit trails</p>
                </div>
              </li>
              <li>
                <SecurityIcon className="list-icon" />
                <div>
                  <h4>Lifecycle Management</h4>
                  <p>Full control over certificate issuance, renewal, and expiration</p>
                </div>
              </li>
              <li>
                <AdminPanelSettingsIcon className="list-icon" />
                <div>
                  <h4>Revocation Services</h4>
                  <p>Immediate certificate revocation with CRL/OCSP support</p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section">
        <h2 className="section-title">Trusted Security Standards</h2>
        <div className="standards-grid">
          <div className="standard-item">
            <h3>X.509 Compliance</h3>
            <p>Full compliance with industry-standard certificate formats</p>
          </div>
          <div className="standard-item">
            <h3>SHA-256 Encryption</h3>
            <p>Military-grade encryption for all cryptographic operations</p>
          </div>
          <div className="standard-item">
            <h3>Audit Ready</h3>
            <p>Comprehensive logging and reporting for compliance audits</p>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;