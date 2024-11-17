import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "./App";

export default function Admin() {
  const navigate = useNavigate();
  const { logout } = useAuth();
  const [stats, setStats] = useState({ totalUsers: 0, activeCertificates: 0, pendingRequests: 0 });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      const response = await fetch('http://localhost:8000/admin/stats', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
        },
      });
      if (response.ok) {
        const data = await response.json();
        setStats(data);
      } else {
        console.error('Failed to fetch stats');
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="admin-page">
      <header>
        <h1>Certificate Authority Service - Admin Dashboard</h1>
        <button onClick={handleLogout} className="logout-button">
          Logout
        </button>
      </header>
      <main>
        <div className="admin-content">
          <h2>Welcome, Admin!</h2>
          <div className="admin-actions">
            <button className="admin-button">Manage Users</button>
            <button className="admin-button">View Logs</button>
            <button className="admin-button">System Settings</button>
          </div>
          <div className="admin-stats">
            <div className="stat-card">
              <h3>Total Users</h3>
              <p>{stats.totalUsers}</p>
            </div>
            <div className="stat-card">
              <h3>Active Certificates</h3>
              <p>{stats.activeCertificates}</p>
            </div>
            <div className="stat-card">
              <h3>Pending Requests</h3>
              <p>{stats.pendingRequests}</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}