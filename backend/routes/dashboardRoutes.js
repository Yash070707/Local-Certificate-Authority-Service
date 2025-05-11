const express = require("express");
const router = express.Router();
const {
  getAdminDashboard,
  getUserDashboard,
} = require("../controllers/dashboardController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.get("/admin", authenticateToken, authorizeAdmin, getAdminDashboard);
router.get("/user", authenticateToken, getUserDashboard);

module.exports = router;