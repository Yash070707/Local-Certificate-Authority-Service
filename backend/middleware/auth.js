const jwt = require("jsonwebtoken");
const pool = require("../config/db");

const authenticateToken = async (req, res, next) => {
  try {
    // Get token from Authorization header
    const authHeader = req.headers["authorization"];
    if (!authHeader || !authHeader.startsWith("Bearer ")) {
      console.error(
        "Authentication failed: No token provided or invalid format"
      );
      return res
        .status(401)
        .json({
          success: false,
          message: "No token provided or invalid format",
        });
    }

    const token = authHeader.replace("Bearer ", "");
    if (!token) {
      console.error("Authentication failed: Invalid token format");
      return res
        .status(401)
        .json({ success: false, message: "Invalid token format" });
    }

    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    if (!decoded.userId) {
      console.error("Authentication failed: Invalid token payload");
      return res
        .status(401)
        .json({ success: false, message: "Invalid token payload" });
    }

    // Fetch user from database
    const userResult = await pool.query(
      "SELECT id, username, role FROM users WHERE id = $1",
      [decoded.userId]
    );

    if (userResult.rowCount === 0) {
      console.error(
        `Authentication failed: User ID ${decoded.userId} not found`
      );
      return res
        .status(401)
        .json({ success: false, message: "User not found" });
    }

    // Attach user to request
    req.user = userResult.rows[0];
    next();
  } catch (error) {
    console.error("Authentication error:", error.message);
    return res
      .status(403)
      .json({ success: false, message: "Invalid or expired token" });
  }
};

const authorizeRole = (role) => {
  return (req, res, next) => {
    if (!req.user || req.user.role !== role) {
      console.error(
        `Authorization failed: User role ${
          req.user?.role || "none"
        } does not match required role ${role}`
      );
      return res.status(403).json({
        success: false,
        message: `Access denied: ${role} role required`,
      });
    }
    next();
  };
};

const authorizeAdmin = authorizeRole("admin");

module.exports = { authenticateToken, authorizeRole, authorizeAdmin };
