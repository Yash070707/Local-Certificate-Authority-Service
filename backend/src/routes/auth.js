const express = require('express');
const { signup, signin, verifyEmail, forgotPassword, resetPassword } = require('../controllers/authController');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.post('/signup', signup);
router.post('/verify-email', verifyEmail);
router.post('/signin', signin);
router.post('/forgot-password', forgotPassword);
router.post('/reset-password', resetPassword);

router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.username}` });
});

router.get('/client', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

module.exports = router;