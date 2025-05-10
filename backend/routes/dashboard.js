const express = require("express");
const router = express.Router();
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");
const {
  getAdminDashboard,
  getUserDashboard,
} = require("../controllers/dashboardController");

router.get("/admin", authenticateToken, authorizeAdmin, getAdminDashboard);
router.get("/user", authenticateToken, getUserDashboard);

module.exports = router;
