const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const otpGenerator = require('otp-generator');
const { sendOTPEmail } = require('../services/emailService');

const JWT_SECRET = process.env.JWT_SECRET;

const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false, // This disables uppercase letters
    lowerCaseAlphabets: false, // This disables lowercase letters
    specialChars: false,       // This disables special characters
    digits: true               // This enables only digits
  });
};

exports.signup = async (req, res) => {
  const { username, email, password, role = 'client' } = req.body;
  try {
    // Check if user already exists
    const userCheck = await pool.query('SELECT * FROM users WHERE username = $1 OR email = $2', [username, email]);
    if (userCheck.rows.length > 0) {
      return res.status(400).json({ error: 'Username or email already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const query = 'INSERT INTO users (username, email, password, role, otp, otp_expiry) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role';
    const result = await pool.query(query, [username, email, hashedPassword, role, otp, otpExpiry]);

    // Send OTP email
    await sendOTPEmail(email, otp, 'signup');

    res.status(201).json({
      message: 'User registered successfully. Please verify your email with the OTP sent.',
      userId: result.rows[0].id,
      role: result.rows[0].role
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expiry > NOW()';
    const result = await pool.query(query, [email, otp]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    // Update user verification status
    await pool.query('UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1', [email]);

    res.json({ message: 'Email verified successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    if (!user.is_verified) {
      return res.status(401).json({ error: 'Please verify your email first' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'User not found' });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    await pool.query('UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3', [otp, otpExpiry, email]);
    await sendOTPEmail(email, otp, 'resetPassword');

    res.json({ message: 'Password reset OTP has been sent to your email' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expiry > NOW()';
    const result = await pool.query(query, [email, otp]);

    if (result.rows.length === 0) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query(
      'UPDATE users SET password = $1, otp = NULL, otp_expiry = NULL WHERE email = $2',
      [hashedPassword, email]
    );

    res.json({ message: 'Password reset successful' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};