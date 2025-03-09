import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { forgotPassword } from "../../api/authApi";
import "./Password.css";

const Forget = () => {
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    try {
      // Pass email as an object with email property
      await forgotPassword({ email });
      setMessage("A password reset link has been sent to your email.");
    } catch (err) {
      console.error("Error details:", err);
      setError("Failed to send reset email. Please try again.");
    }
  };

  return (
    <div className="password-container">
      <div className="password-content">
        <h2>Reset Your Password</h2>
        <p>Enter your email address and we'll send you a reset link.</p>

        <form onSubmit={handleSubmit} className="password-form">
          <div className="form-group">
            <label>Email Address</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          {message && <div className="success-message">{message}</div>}
          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="submit-btn">Send Reset Link</button>
        </form>

        <button onClick={() => navigate("/login")} className="back-btn">
          Back to Login
        </button>
      </div>
    </div>
  );
};

export default Forget;