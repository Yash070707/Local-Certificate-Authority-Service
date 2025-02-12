import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import RoleSwitch from '../../components/Auth/RoleSwitch';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [role, setRole] = useState('user');
  const [error, setError] = useState('');
  const { login: contextLogin } = useContext(AuthContext);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const { token, user } = await login(credentials, role);
      contextLogin(token, user, role);
      navigate(role === 'admin' ? '/admin' : '/user');
    } catch (err) {
      setError('Invalid credentials for selected role');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{role.toUpperCase()} LOGIN</h2>
        <RoleSwitch role={role} setRole={setRole} />
        
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            value={credentials.username}
            onChange={(e) => setCredentials({...credentials, username: e.target.value})}
          />
          <input
            type="password"
            placeholder="Password"
            value={credentials.password}
            onChange={(e) => setCredentials({...credentials, password: e.target.value})}
          />
          <button type="submit">Sign In</button>
          {error && <p className="error">{error}</p>}
        </form>
      </div>
    </div>
  );
};

export default Login;