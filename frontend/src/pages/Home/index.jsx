import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css';

const Home = () => {
  return (
    <div className="home-container">
      <header className="hero-section">
        <h1>Secure Certificate Authority Service</h1>
        <p>Issue and manage digital certificates with enterprise-grade security</p>
        <div className="cta-buttons">
          <Link to="/auth/login" className="btn primary">Login</Link>
          <Link to="/auth/signup" className="btn secondary">Sign Up</Link>
        </div>
      </header>
      
      <section className="features">
        <div className="feature-card">
          <h3>User Features</h3>
          <ul>
            <li>Generate Certificate Requests</li>
            <li>Track Request Status</li>
            <li>Download Certificates</li>
          </ul>
        </div>
        
        <div className="feature-card">
          <h3>Admin Features</h3>
          <ul>
            <li>Manage CSR Requests</li>
            <li>Certificate Lifecycle Management</li>
            <li>Revocation Services</li>
          </ul>
        </div>
      </section>
    </div>
  );
};

export default Home;