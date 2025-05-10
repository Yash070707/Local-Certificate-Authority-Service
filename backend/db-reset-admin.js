// Save this as db-reset-admin.js in your backend folder
require("dotenv").config();
const bcrypt = require("bcrypt");
const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});

async function resetAdminUser() {
  try {
    console.log("Connecting to database...");
    const client = await pool.connect();

    try {
      // First try to delete existing admin user
      console.log("Deleting existing admin user if exists...");
      await client.query("DELETE FROM users WHERE username = 'admin'");

      // Create a new admin user with a known password
      const adminPassword = "admin123";
      const hashedPassword = await bcrypt.hash(adminPassword, 10);

      console.log("Creating new admin user...");
      const result = await client.query(
        "INSERT INTO users (username, email, password, role, is_verified) VALUES ($1, $2, $3, $4, $5) RETURNING id",
        ["admin", "admin@example.com", hashedPassword, "admin", true]
      );

      console.log(
        `✅ Admin user created successfully with ID: ${result.rows[0].id}`
      );
      console.log(`Username: admin`);
      console.log(`Password: ${adminPassword}`);
    } finally {
      client.release();
    }
  } catch (err) {
    console.error("Error resetting admin user:", err);
  } finally {
    await pool.end();
  }
}

resetAdminUser();
