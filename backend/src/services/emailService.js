const nodemailer = require('nodemailer');
require('dotenv').config();

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD
  }
});

const sendOTPEmail = async (email, otp, purpose) => {
  const subjectMap = {
    signup: 'Email Verification OTP for Signup',
    resetPassword: 'Password Reset OTP'
  };

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to: email,
    subject: subjectMap[purpose],
    html: `
      <h1>${purpose === 'signup' ? 'Welcome to Our Service!' : 'Password Reset Request'}</h1>
      <p>Your OTP for ${purpose === 'signup' ? 'email verification' : 'password reset'} is: <strong>${otp}</strong></p>
      <p>This OTP will expire in 10 minutes.</p>
      <p>If you didn't request this, please ignore this email.</p>
    `
  };

  try {
    await transporter.sendMail(mailOptions);
    return true;
  } catch (error) {
    console.error('Email sending failed:', error);
    return false;
  }
};

module.exports = { sendOTPEmail };