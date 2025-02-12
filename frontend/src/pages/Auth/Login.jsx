import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import RoleSwitch from '../../components/Auth/RoleSwitch';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login: authLogin } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await login(credentials, role);
      authLogin(token, user, role);
      navigate(role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError('Authentication failed. Please check your credentials.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{role.charAt(0).toUpperCase() + role.slice(1)} Login</h2>
        <RoleSwitch role={role} setRole={setRole} />
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
            required
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
            required
          />
          <button type="submit" className="submit-btn">Sign In</button>
          {error && <div className="error-message">{error}</div>}
        </form>
      </div>
    </div>
  );
};

export default Login;