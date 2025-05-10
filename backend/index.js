const express = require("express");
const cors = require("cors");
const bcrypt = require("bcrypt");
const pool = require("./config/db");
const authRoutes = require("./routes/auth");
const certificateRoutes = require("./routes/certificates");
const dashboardRoutes = require("./routes/dashboard");
require("dotenv").config();

const app = express();

app.use(express.json());

// CORS configuration
const corsOptions = {
  origin: ["http://127.0.0.1:5173", "http://localhost:5173"],
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true,
};

app.use(cors(corsOptions));

// Debug CORS headers
app.use((req, res, next) => {
  console.log(`Request Origin: ${req.get("Origin")}`);
  console.log(
    `CORS Headers Set: Access-Control-Allow-Origin: ${
      res.get("Access-Control-Allow-Origin") || "Not set yet"
    }`
  );
  next();
});

// Handle CORS preflight requests
app.options("*", cors(corsOptions));

app.use("/api/auth", authRoutes);
app.use("/api/certificate", certificateRoutes);
app.use("/api/dashboard", dashboardRoutes);

// Function to create admin user if it doesn't exist
const createAdminIfNotExists = async () => {
  try {
    // Check if admin exists
    const adminCheck = await pool.query(
      "SELECT * FROM users WHERE username = $1",
      ["admin"]
    );

    console.log(`Admin check found ${adminCheck.rows.length} rows`);

    if (adminCheck.rows.length === 0) {
      console.log("Admin user does not exist, creating...");
      const hashedPassword = await bcrypt.hash("admin@123", 10); // Updated password
      const result = await pool.query(
        "INSERT INTO users (username, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["admin", "caservice2025@gmail.com", hashedPassword, "admin", true] // Updated email
      );
      console.log(
        `✅ Admin user created successfully with ID: ${result.rows[0].id}`
      );
    } else {
      const adminUser = adminCheck.rows[0];
      console.log(
        `Admin user exists with ID: ${adminUser.id}, role: ${adminUser.role}, verified: ${adminUser.is_verified}`
      );

      if (adminUser.role !== "admin" || !adminUser.is_verified) {
        console.log("Updating admin user role and verification status");
        await pool.query(
          "UPDATE users SET role = 'admin', is_verified = true WHERE username = 'admin'"
        );
        console.log("✅ Admin user updated successfully");
      }
    }
  } catch (err) {
    console.error("Error with admin user:", err);
  }
};

// Debug endpoint to check database connection
app.get("/api/debug/db", async (req, res) => {
  try {
    const result = await pool.query("SELECT NOW()");
    res.json({
      success: true,
      message: "Database connection successful",
      timestamp: result.rows[0].now,
    });
  } catch (error) {
    console.error("Database connection error:", error);
    res.status(500).json({
      success: false,
      message: "Database connection failed",
      error: error.message,
    });
  }
});

// Debug endpoint to check admin user
app.get("/api/debug/admin", async (req, res) => {
  try {
    const result = await pool.query(
      "SELECT id, username, email, role, is_verified FROM users WHERE username = 'admin'"
    );
    if (result.rows.length > 0) {
      res.json({
        success: true,
        admin: result.rows[0],
      });
    } else {
      res.json({
        success: false,
        message: "Admin user not found",
      });
    }
  } catch (error) {
    console.error("Admin check error:", error);
    res.status(500).json({
      success: false,
      message: "Error checking admin user",
      error: error.message,
    });
  }
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ success: false, message: "Internal server error" });
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, async () => {
  console.log(`✅ Server running on port ${PORT}`);
  await createAdminIfNotExists();
});
