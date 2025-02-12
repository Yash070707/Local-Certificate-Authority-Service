import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import RoleSwitch from '../../components/Auth/RoleSwitch';
import { register } from '../../api/authApi';
import './Auth.css';

const Signup = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '',
    role: 'user' 
  });
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await register({
        username: credentials.username,
        password: credentials.password,
        role: credentials.role
      });
      login(token, user, credentials.role);
      navigate(credentials.role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError('Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Create {credentials.role} Account</h2>
        <RoleSwitch 
          role={credentials.role} 
          setRole={(role) => setCredentials({...credentials, role})}
        />
        
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
          <button type="submit" className="submit-btn">Create Account</button>
          {error && <div className="error-message">{error}</div>}
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;