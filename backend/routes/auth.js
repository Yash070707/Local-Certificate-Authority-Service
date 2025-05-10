const express = require("express");
const router = express.Router();
const jwt = require("jsonwebtoken"); // Make sure jwt is imported
const authController = require("../controllers/authController");

// Routes
router.post("/signin", authController.signin);
router.post("/signup", authController.signup);
router.post("/verify-email", authController.verifyEmail);
router.post("/forgot-password", authController.forgotPassword);
router.post("/reset-password", authController.resetPassword);

// These admin and user check routes can remain for additional verification
router.get("/admin", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (decoded.role !== "admin") {
      return res.status(403).json({
        success: false,
        message: "Access denied: admin role required",
      });
    }

    res.json({ success: true, message: "Welcome, Admin!", user: decoded });
  } catch (error) {
    console.error("Admin route error:", error);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

router.get("/user", async (req, res) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ success: false, message: "Access token missing" });
  }

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    res.json({ success: true, message: "Welcome, User!", user: decoded });
  } catch (error) {
    console.error("User route error:", error);
    res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
});

module.exports = router;
