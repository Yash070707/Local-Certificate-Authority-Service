const express = require("express");
const router = express.Router();
const {
  getAdminDashboardStats,
  getUserDashboardStats,
} = require("../controllers/certificateController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.get("/admin", authenticateToken, authorizeAdmin, getAdminDashboardStats);
router.get("/user", authenticateToken, getUserDashboardStats);

module.exports = router;