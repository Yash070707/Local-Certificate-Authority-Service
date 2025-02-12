import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <div className="hero-section">
        <h1>Local Certificate Authority</h1>
        <p>Secure digital certificate management solution</p>
        <div className="cta-buttons">
          <Link to="/login" className="btn primary">Get Started</Link>
          <Link to="/login" className="btn secondary">Admin Portal</Link>
        </div>
      </div>
      
      <div className="features-section">
        <div className="feature-card">
          <h3>For Users</h3>
          <ul>
            <li>Generate Certificate Requests</li>
            <li>Track Request Status</li>
            <li>Download Certificates</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <h3>For Administrators</h3>
          <ul>
            <li>Manage CSR Requests</li>
            <li>Certificate Lifecycle Management</li>
            <li>Revocation Services</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default Home;