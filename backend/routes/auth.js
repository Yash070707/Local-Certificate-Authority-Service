const express = require("express");
const router = express.Router();
const authController = require("../controllers/authController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

// Routes
router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// Admin check route
router.get("/admin", authenticateToken, authorizeAdmin, (req, res) => {
  res.json({
    success: true,
    message: "Welcome, Admin!",
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
});

// User check route
router.get("/user", authenticateToken, (req, res) => {
  res.json({
    success: true,
    message: "Welcome, User!",
    user: {
      id: req.user.id,
      username: req.user.username,
      role: req.user.role,
    },
  });
});

module.exports = router;