

import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
  const location = useLocation();
  const { login: contextLogin } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login({ 
        username: credentials.username, 
        password: credentials.password 
      });
      
      if (response && response.token && response.user) {
        contextLogin(response);
        
        // Redirect to the intended route (from state) or based on role
        const redirectTo = location.state?.from?.pathname || 
                          (response.user.role === 'admin' ? '/admin' : '/user');
        navigate(redirectTo, { replace: true });
      } else {
        throw new Error('Invalid response from server');
      }
    } catch (error) {
      console.error('Login error:', error);
      setError(error.message || 'Login failed');
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
