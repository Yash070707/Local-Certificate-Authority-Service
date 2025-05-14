import React from 'react';
import { Link } from 'react-router-dom';
import SecurityIcon from '@mui/icons-material/Security';
import AssignmentIcon from '@mui/icons-material/Assignment';
import DownloadIcon from '@mui/icons-material/Download';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import GppGoodIcon from '@mui/icons-material/GppGood';
import VerifiedIcon from '@mui/icons-material/Verified';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      {/* Hero Section */}
      <section className="hero-section" data-aos="fade-up">
        <div className="hero-content">
          <svg className="hero-icon" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2L2 7v10l10 5 10-5V7L12 2z" stroke="#00A3E0" strokeWidth="2" />
            <path d="M12 12l-4-2m4 2l4-2m-4 2v5" stroke="#00A3E0" strokeWidth="2" />
          </svg>
          <h1 className="hero-title">
            Local Certificate Authority
          </h1>
          <p className="hero-subtitle">
            Secure, enterprise-grade PKI for digital certificate management
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
      <section className="features-section" data-aos="fade-up">
        <h2 className="section-title">Core Features</h2>
        <div className="features-grid">
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="100">
            <AssignmentIcon className="feature-icon" />
            <h3>CSR Generation</h3>
            <p>Create and validate certificate signing requests with ease, supporting custom attributes.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="200">
            <DownloadIcon className="feature-icon" />
            <h3>Certificate Management</h3>
            <p>Track, download, and manage certificates securely through an intuitive dashboard.</p>
          </div>
          <div className="feature-card" data-aos="zoom-in" data-aos-delay="300">
            <AdminPanelSettingsIcon className="feature-icon" />
            <h3>Admin Controls</h3>
            <p>Approve or reject CSRs with detailed logs and real-time notifications.</p>
          </div>
        </div>
      </section>

      {/* Trust Section */}
      <section className="trust-section" data-aos="fade-up">
        <h2 className="section-title">Built on Trusted Standards</h2>
        <div className="standards-grid">
          <div className="standard-item" data-aos="fade-right">
            <VerifiedIcon className="standard-icon" />
            <h3>X.509 Compliance</h3>
            <p>Adheres to industry-standard certificate formats for universal compatibility.</p>
          </div>
          <div className="standard-item" data-aos="fade-up">
            <SecurityIcon className="standard-icon" />
            <h3>SHA-256 Encryption</h3>
            <p>Ensures robust security for all cryptographic operations.</p>
          </div>
          <div className="standard-item" data-aos="fade-left">
            <GppGoodIcon className="standard-icon" />
            <h3>Secure Authentication</h3>
            <p>JWT-based authentication with role-based access control.</p>
          </div>
        </div>
      </section>

      {/* Get Started Section */}
      <section className="get-started-section" data-aos="fade-up">
        <h2 className="section-title">Ready to Secure Your Enterprise?</h2>
        <p className="section-subtitle">
          Explore our PKI solution or request a demo to see it in action.
        </p>
        <div className="get-started-form">
          <Link to="/signup" className="btn primary">
            Request Demo
          </Link>
        </div>
      </section>

      {/* Footer */}
      <footer className="footer">
        <div className="footer-content">
          <div className="footer-brand">
            <h3>Local CA</h3>
            <p>Secure certificate management for the modern enterprise.</p>
          </div>
          <div className="footer-links">
            <h4>Links</h4>
            <ul>
              <li><Link to="/login">Login</Link></li>
              <li><Link to="/signup">Signup</Link></li>
              <li><a href="https://github.com/imabhi7/Local-Certificate-Authority-Service">GitHub</a></li>
            </ul>
          </div>
          <div className="footer-contact">
            <h4>Contact</h4>
            <p>Email: <a href="mailto:caservice2025@gmail.com">caservice2025@gmail.com</a></p>
          </div>
        </div>
        <div className="footer-bottom">
          <p>&copy; 2025 Local Certificate Authority Service. All rights reserved.</p>
        </div>
      </footer>
    </div>
  );
};

export default Home;