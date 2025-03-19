import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { login } from '../../api/authApi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Auth.css';

const Login = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '' 
  });
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors
  
    try {
      const { token, userId, role } = await login({
        username: credentials.username,
        password: credentials.password,
      });
  
      contextLogin(token, { id: userId, username: credentials.username }, role);
      console.log(`Login successful for ${credentials.username} for role ${role}`);
      if (role === "client") {
        navigate('/user');
      } else {
        navigate('/admin');
      }
    } catch (err) {
      setError(err.message || 'Invalid username or password');
    }
  };  

  const handleClickShowPassword = () => {
    setShowPassword(!showPassword);
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Certificate Authority Login</h1>
        
        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={credentials.username}
              onChange={(e) => setCredentials({...credentials, username: e.target.value})}
              required
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={credentials.password}
                onChange={(e) => setCredentials({...credentials, password: e.target.value})}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={handleClickShowPassword}
                aria-label="toggle password visibility"
              >
                {showPassword ? (
                  <Visibility className="eye-icon" />
                ) : (
                  <VisibilityOff className="eye-icon" />
                )}
              </button>
            </div>
          </div>

          {/* Forgot Password Link */}
          <div className="forgot-password">
            <Link to="/forgot-password" className="forgot-password-link">
              Forgot Password?
            </Link>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">
            Sign In
          </button>
        </form>

        <p className="auth-redirect">
          Don't have an account?{' '}
          <Link to="/signup" className="auth-link">
            Create Account
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;