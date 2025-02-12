const express = require('express');
const { signup, signin } = require('../controllers/authController');
const router = express.Router();
const { authenticateToken, authorizeRole } = require('../middleware/auth');

router.get('/admin', authenticateToken, authorizeRole('admin'), (req, res) => {
  res.json({ message: `Welcome, Admin ${req.user.username}` });
});

router.post('/signup', signup);
router.post('/signin', signin);
router.get('/client', authenticateToken, (req, res) => {
  res.json({ message: `Welcome, ${req.user.username}` });
});

module.exports = router;