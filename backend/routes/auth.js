const express = require('express');
const authController = require('../controllers/authController');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');


router.post('/signup', authController.signup);
router.post('/verify-email', authController.verifyEmail);
router.post('/signin', authController.signin);
router.post('/forgot-password', authController.forgotPassword);
router.post('/reset-password', authController.resetPassword);


router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.username}` });
});

router.get('/client', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

module.exports = router;