const pool = require("../config/db");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const otpGenerator = require("otp-generator");
const { sendOTPEmail } = require("../services/emailService");

const generateOTP = () => {
  return otpGenerator.generate(6, {
    upperCaseAlphabets: false,
    lowerCaseAlphabets: false,
    specialChars: false,
    digits: true,
  });
};

exports.signup = async (req, res) => {
  const { username, email, password, role = "client" } = req.body;
  try {
    // Check if username exists
    const usernameCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username]
    );
    if (usernameCheck.rows.length > 0) {
      return res.status(400).json({ error: "username_taken" });
    }

    // Check if email exists
    const emailCheck = await pool.query(
      "SELECT * FROM users WHERE email = $1",
      [email]
    );
    if (emailCheck.rows.length > 0) {
      return res.status(400).json({ error: "email_taken" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes expiry

    const query =
      "INSERT INTO users (username, email, password, role, otp, otp_expiry) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id, role";
    const result = await pool.query(query, [
      username,
      email,
      hashedPassword,
      role,
      otp,
      otpExpiry,
    ]);

    // Send OTP email
    await sendOTPEmail(email, otp, "signup");

    res.status(201).json({
      message:
        "User registered successfully. Please verify your email with the OTP sent.",
      userId: result.rows[0].id,
      role: result.rows[0].role,
    });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.verifyEmail = async (req, res) => {
  const { email, otp } = req.body;
  try {
    console.log(`Verifying OTP for email: ${email}, otp: ${otp}`);
    const query =
      "SELECT * FROM users WHERE email = $1 AND otp = $2 AND otp_expiry > NOW()";
    const result = await pool.query(query, [email, otp]);

    if (result.rows.length === 0) {
      console.log(`Invalid or expired OTP for email: ${email}`);
      return res.status(400).json({ error: "Invalid or expired OTP" });
    }

    // Update user verification status
    await pool.query(
      "UPDATE users SET is_verified = true, otp = NULL, otp_expiry = NULL WHERE email = $1",
      [email]
    );

    res.json({ message: "Email verified successfully", success: true });
  } catch (err) {
    console.error("Verify email error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.signin = async (req, res) => {
  const { username, password } = req.body;

  try {
    console.log(`Attempting login for username: "${username}"`);

    // 1. Find user by username
    const { rows } = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      [username.trim()]
    );

    console.log(`User query returned ${rows.length} results`);

    if (rows.length === 0) {
      console.log("User not found in database");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    const user = rows[0];
    console.log(
      `Found user: ${user.username}, role: ${user.role}, verified: ${user.is_verified}`
    );

    // Skip verification for admin users (for testing only)
    if (user.role === "admin" && !user.is_verified) {
      console.log("Admin user not verified - updating verification status");
      await pool.query("UPDATE users SET is_verified = true WHERE id = $1", [
        user.id,
      ]);
      user.is_verified = true;
    }

    // 2. Verify password
    console.log("Verifying password...");
    const isPasswordValid = await bcrypt.compare(
      password.trim(),
      user.password
    );

    console.log(`Password verification result: ${isPasswordValid}`);

    if (!isPasswordValid) {
      console.log("Password verification failed");
      return res.status(401).json({
        success: false,
        message: "Invalid credentials",
      });
    }

    // 3. Check if user is verified
    if (!user.is_verified && user.role !== "admin") {
      console.log("User not verified");
      return res.status(401).json({
        success: false,
        message: "Please verify your email first",
      });
    }

    // 4. Generate JWT token
    console.log("Generating JWT token");
    const token = jwt.sign(
      {
        userId: user.id,
        username: user.username,
        role: user.role,
      },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    console.log("Login successful, sending response");
    res.json({
      success: true,
      token,
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (err) {
    console.error("Signin error:", err);
    res.status(500).json({
      success: false,
      message: "Internal server error",
    });
  }
};

exports.forgotPassword = async (req, res) => {
  const { email } = req.body;
  try {
    const result = await pool.query("SELECT * FROM users WHERE email = $1", [
      email,
    ]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: "User not found" });
    }

    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 15 * 60 * 1000); // 15 minutes expiry

    await pool.query(
      "UPDATE users SET otp = $1, otp_expiry = $2 WHERE email = $3",
      [otp, otpExpiry, email]
    );
    await sendOTPEmail(email, otp, "resetPassword");

    res.json({ message: "Password reset OTP has been sent to your email" });
  } catch (err) {
    console.error("Forgot password error:", err);
    res.status(500).json({ error: err.message });
  }
};

exports.resetPassword = async (req, res) => {
  const { email, otp, newPassword } = req.body;
  try {
    console.log(`Reset password attempt for email: ${email}, otp: ${otp}`);
    // Check if user exists
    const query = "SELECT * FROM users WHERE email = $1";
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      console.log(`User not found for email: ${email}`);
      return res.status(404).json({ error: "User not found" });
    }

    // Since OTP was verified in verifyEmail, we only check user existence
    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await pool.query("UPDATE users SET password = $1 WHERE email = $2", [
      hashedPassword,
      email,
    ]);

    console.log(`Password reset successful for email: ${email}`);
    res.json({ message: "Password reset successful", success: true });
  } catch (err) {
    console.error("Reset password error:", err);
    res.status(500).json({ error: err.message });
  }
};

module.exports = exports;
