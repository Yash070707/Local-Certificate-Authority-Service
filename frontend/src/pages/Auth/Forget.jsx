import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { forgotPassword } from '../../api/authApi';
import './Auth.css';

const Forget = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    try {
      console.log(`Submitting forgot password for email: ${email}`);
      const response = await forgotPassword({ email });
      if (response.message) {
        setSuccess('OTP sent to your email. Redirecting to verify...');
        console.log(`Navigating to /verify-otp with type: reset, email: ${email}`);
        setTimeout(() => {
          navigate('/verify-otp', { state: { email, type: 'reset' } });
        }, 1000);
      } else {
        setError(response.message || 'Failed to send OTP. Please try again.');
      }
    } catch (err) {
      console.error('Forgot password error:', err);
      setError(err.message || 'Error sending OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Forgot Password</h1>
        <p className="auth-subtext">Enter your email to receive an OTP for password reset.</p>

        <form onSubmit={handleSubmit} className="auth-form">
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

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Sending...' : 'Send OTP'}
          </button>
        </form>

        <p className="auth-redirect">
          Back to{' '}
          <Link to="/login" className="auth-link">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Forget;