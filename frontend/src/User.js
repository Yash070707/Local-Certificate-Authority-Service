import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./App";

export default function User() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [userInfo, setUserInfo] = useState({ activeCertificates: 0, pendingRequests: 0, daysToExpiration: 0 });

  useEffect(() => {
    fetchUserInfo();
  }, []);

  const fetchUserInfo = async () => {
    try {
      const response = await fetch('http://localhost:8000/user/info', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setUserInfo(data);
      } else {
        console.error('Failed to fetch user info');
      }
    } catch (error) {
      console.error('Error fetching user info:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="user-page">
      <header>
        <h1>Certificate Authority Service - User Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main>
        <div className="user-content">
          <h2>Welcome, User!</h2>
          <div className="user-actions">
            <button className="user-button">Request Certificate</button>
            <button className="user-button">View My Certificates</button>
            <button className="user-button">Account Settings</button>
          </div>
          <div className="user-info">
            <div className="info-card">
              <h3>Active Certificates</h3>
              <p>{userInfo.activeCertificates}</p>
            </div>
            <div className="info-card">
              <h3>Pending Requests</h3>
              <p>{userInfo.pendingRequests}</p>
            </div>
            <div className="info-card">
              <h3>Days to Expiration</h3>
              <p>{userInfo.daysToExpiration}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}