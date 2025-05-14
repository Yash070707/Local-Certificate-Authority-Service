import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { verifyOtp } from '../../api/authApi';
import './Auth.css';

const VerifyOtp = () => {
  const [otp, setOtp] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  
  // Get email and type from state or query parameters
  const queryParams = new URLSearchParams(location.search);
  const emailFromQuery = queryParams.get('email') || '';
  const typeFromQuery = queryParams.get('type') || '';
  const { email = emailFromQuery, type = typeFromQuery } = location.state || {};

  useEffect(() => {
    console.log('VerifyOTP state:', { email, type, emailFromQuery, typeFromQuery });
    if (!email) {
      console.warn('No email provided, redirecting to signup');
      navigate('/signup');
    }
    if (!['signup', 'reset'].includes(type)) {
      console.warn(`Invalid type: ${type}, redirecting to signup`);
      navigate('/signup');
    }
  }, [email, type, navigate]);

  const handleVerify = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsLoading(true);

    if (!otp) {
      setError('Please enter OTP');
      setIsLoading(false);
      return;
    }

    try {
      console.log(`Verifying OTP for email: ${email}, type: ${type}`);
      const response = await verifyOtp({ email, otp });
      if (response.success) {
        if (type === 'reset') {
          setSuccess('OTP verified successfully! Redirecting to reset password...');
          console.log('Redirecting to /reset-password');
          navigate('/reset-password', { state: { email, otp } });
        } else if (type === 'signup') {
          setSuccess('Email verified successfully! Redirecting to login...');
          console.log('Redirecting to /login');
          navigate('/login');
        }
      } else {
        setError(response.message || 'Invalid OTP. Please try again.');
      }
    } catch (err) {
      console.error('OTP verification failed:', err);
      setError(err.message || 'Error verifying OTP. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Verify OTP</h1>
        <p className="auth-subtext">
          {type === 'reset'
            ? `Enter the 6-digit OTP sent to ${email} to reset your password.`
            : `Enter the 6-digit OTP sent to ${email} to verify your email.`}
        </p>

        <form onSubmit={handleVerify} className="auth-form">
          <div className="form-group">
            <label>OTP</label>
            <input
              type="text"
              value={otp}
              onChange={(e) => setOtp(e.target.value)}
              required
              maxLength="6"
              pattern="\d{6}"
              placeholder="Enter 6-digit OTP"
            />
          </div>

          {error && <div className="error-message">{error}</div>}
          {success && <div className="success-message">{success}</div>}

          <button
            type="submit"
            className="submit-btn"
            disabled={isLoading}
          >
            {isLoading ? 'Verifying...' : 'Verify OTP'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default VerifyOtp;