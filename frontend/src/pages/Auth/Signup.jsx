import React from 'react';
import { Link } from 'react-router-dom';
import RoleSwitch from '../../components/Auth/RoleSwitch';
import './Auth.css';

const Signup = () => {
  const [role, setRole] = useState('user');

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>{role} Sign Up</h2>
        <RoleSwitch role={role} setRole={setRole} />
        
        <form>
          <input
            type="text"
            placeholder="Username"
            required
          />
          <input
            type="password"
            placeholder="Password"
            required
          />
          <button type="submit">Create Account</button>
        </form>
        
        <p>Already have an account? <Link to="/login">Login</Link></p>
      </div>
    </div>
  );
};

export default Signup;