import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register } from '../../api/authApi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import './Auth.css';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (password !== confirmPassword) {
      setError('Passwords do not match');
      setIsLoading(false);
      return;
    }

    if (password.length < 8) {
      setError('Password must be at least 8 characters long');
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Submitting signup for username: ${username}, email: ${email}`);
      const response = await register({ username, email, password });
      if (response.message) {
        setSuccess('Registration successful! OTP sent to your email. Redirecting to verify...');
        console.log(`Navigating to /verify-otp with type: signup, email: ${email}`);
        setTimeout(() => {
          navigate('/verify-otp', { state: { email, type: 'signup' } });
        }, 1000);
      }
    } catch (err) {
      console.error('Signup error:', err);
      if (err.message === 'email_taken') {
        setError('Email already in use');
      } else if (err.message === 'username_taken') {
        setError('Username taken');
      } else {
        setError(err.message || 'Error during signup. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Create Account</h1>
        <p className="auth-subtext">Sign up to access the Local Certificate Authority Service.</p>

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label>Username</label>
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              placeholder="Enter your username"
            />
          </div>

          <div className="form-group">
            <label>Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
            />
          </div>

          <div className="form-group">
            <label>Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                placeholder="Enter your password"
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
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

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                placeholder="Confirm your password"
              />
              <button
                type="button"
                classNamewasser="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
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

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Creating...' : 'Create Account'}
          </button>
        </form>

        <p className="auth-redirect">
          Already have an account?{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;