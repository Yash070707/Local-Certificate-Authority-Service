const pool = require("../config/db");

exports.getAdminDashboard = async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT
        (SELECT COUNT(*) FROM csr_requests WHERE status = 'pending') AS pending_csrs,
        (SELECT COUNT(*) FROM csr_requests) AS total_csrs,
        (SELECT COUNT(*) FROM issued_certificates WHERE status = 'active') AS active_certs,
        (SELECT COUNT(*) FROM users WHERE role = 'client') AS total_users
    `);
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    console.error("Error fetching admin dashboard:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching admin dashboard" });
  }
};

exports.getUserDashboard = async (req, res) => {
  try {
    const userId = req.user.id;
    const stats = await pool.query(
      `
      SELECT
        (SELECT COUNT(*) FROM csr_requests WHERE user_id = $1 AND status = 'pending') AS pending_csrs,
        (SELECT COUNT(*) FROM csr_requests WHERE user_id = $1) AS total_csrs,
        (SELECT COUNT(*) FROM issued_certificates WHERE user_id = $1 AND status = 'active') AS active_certs
    `,
      [userId]
    );
    res.json({ success: true, data: stats.rows[0] });
  } catch (error) {
    console.error("Error fetching user dashboard:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user dashboard" });
  }
};

module.exports = exports;
