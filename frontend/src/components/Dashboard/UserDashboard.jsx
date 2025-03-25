import React, { useState } from "react";
import { useAuth } from "../../contexts/AuthContext";
import CSRForm from "../../components/CSRForm";
import { submitCSR } from "../../api/certificateApi"; // ✅ Now correctly imported
import { Link } from "react-router-dom";
import "./UserDashboard.css";

const UserDashboard = () => {
  const { token, user } = useAuth();
  const [requests, setRequests] = useState([]);
  const [successMessage, setSuccessMessage] = useState("");
  const [errorMessage, setErrorMessage] = useState("");

  const handleCSRSubmit = async (csrData) => {
    try {
      const response = await submitCSR(csrData);

      if (response.success) {
        setRequests([...requests, response]);
        setSuccessMessage("CSR submitted successfully! Check your email for updates.");
        setTimeout(() => setSuccessMessage(""), 3000);
      } else {
        throw new Error(response.message || "Unknown error occurred.");
      }
    } catch (error) {
      console.error("CSR submission failed:", error);
      setErrorMessage("CSR submission failed. Please try again.");
      setTimeout(() => setErrorMessage(""), 3000);
    }
  };

  return (
    <div className="user-dashboard">
      <nav className="navbar">
        <ul>
          <li>
            <Link to="/generate-csr">Generate CSR</Link>
          </li>
          <li>
            <a href="#user-dashboard">User Dashboard</a>
          </li>
          <li>
            <a href="#analytics">Analytics</a>
          </li>
        </ul>
      </nav>

      <header className="dashboard-header">
        <h1>Welcome, {user?.username || "User"}</h1>
        <p>Certificate Request Management</p>
      </header>

      <div className="dashboard-content">
        {successMessage && <div className="success-banner">{successMessage}</div>}
        {errorMessage && <div className="error-banner">{errorMessage}</div>}

        <section id="generate-csr" className="csr-section">
          <h2>New Certificate Request</h2>
          <CSRForm onSubmit={handleCSRSubmit} />
        </section>

        <section id="user-dashboard" className="requests-section">
          <h3>Pending Requests</h3>
          <div className="requests-list">
            {requests.length === 0 ? (
              <p>No pending requests.</p>
            ) : (
              requests.map((request, index) => (
                <div key={index} className="request-item">
                  <span>{request.commonName}</span>
                  <span>{request.status}</span>
                </div>
              ))
            )}
          </div>
        </section>

        <section id="analytics" className="analytics-section">
          <h3>Analytics</h3>
          {/* Add analytics */}
        </section>
      </div>
    </div>
  );
};

export default UserDashboard;
