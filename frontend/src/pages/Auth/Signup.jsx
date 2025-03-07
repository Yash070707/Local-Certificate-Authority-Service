import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../../contexts/AuthContext';
import { register } from '../../api/authApi';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import CheckCircleOutlineIcon from '@mui/icons-material/CheckCircleOutline';
import HighlightOffIcon from '@mui/icons-material/HighlightOff';
import './Auth.css';

const Signup = () => {
  const [credentials, setCredentials] = useState({ 
    username: '', 
    password: '',
    confirmPassword: ''
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [error, setError] = useState('');
  const [passwordValidations, setPasswordValidations] = useState({
    minLength: false,
    hasUpper: false,
    hasNumber: false,
    hasSpecial: false,
  });
  const navigate = useNavigate();
  const { login: contextLogin } = useAuth();

  const passwordRequirements = [
    { id: 'minLength', text: 'Minimum 8 characters' },
    { id: 'hasUpper', text: 'At least one uppercase letter' },
    { id: 'hasNumber', text: 'At least one number' },
    { id: 'hasSpecial', text: 'At least one special character' },
  ];

  useEffect(() => {
    const validations = {
      minLength: credentials.password.length >= 8,
      hasUpper: /[A-Z]/.test(credentials.password),
      hasNumber: /\d/.test(credentials.password),
      hasSpecial: /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(credentials.password),
    };
    setPasswordValidations(validations);
  }, [credentials.password]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (credentials.password !== credentials.confirmPassword) {
      setError('Passwords do not match');
      return;
    }
    if (Object.values(passwordValidations).some(valid => !valid)) {
      setError('Password does not meet requirements');
      return;
    }
    try {
      const { userId, role } = await register({
        username: credentials.username,
        password: credentials.password
      });
      contextLogin(null, { id: userId, username: credentials.username }, role);
      navigate(role === 'admin' ? '/admin' : '/user');      
    } catch (err) {
      setError('Registration failed. Username might be taken.');
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-content">
        <h1 className="auth-title">Create CA Account</h1>
        
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
                onClick={() => setShowPassword(!showPassword)}
                aria-label="toggle password visibility"
              >
                {showPassword ? <Visibility className="eye-icon" /> : <VisibilityOff className="eye-icon" />}
              </button>
            </div>
            
            <div className="password-validation">
              {passwordRequirements.map(req => (
                <div key={req.id} className="validation-item">
                  {passwordValidations[req.id] ? (
                    <CheckCircleOutlineIcon className="valid-icon" />
                  ) : (
                    <HighlightOffIcon className="invalid-icon" />
                  )}
                  <span>{req.text}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="form-group">
            <label>Confirm Password</label>
            <div className="password-input-container">
              <input
                type={showConfirmPassword ? 'text' : 'password'}
                value={credentials.confirmPassword}
                onChange={(e) => setCredentials({...credentials, confirmPassword: e.target.value})}
                required
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                aria-label="toggle password visibility"
              >
                {showConfirmPassword ? <Visibility className="eye-icon" /> : <VisibilityOff className="eye-icon" />}
              </button>
            </div>
          </div>

          {error && <div className="error-message">{error}</div>}

          <button 
            type="submit" 
            className="submit-btn"
            disabled={!Object.values(passwordValidations).every(valid => valid) || 
                      credentials.password !== credentials.confirmPassword}
          >
            Create Account
          </button>
        </form>

        <p className="auth-redirect">
          Already have an account? <Link to="/login">Login here</Link>
        </p>
      </div>
    </div>
  );
};

export default Signup;