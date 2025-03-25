const { Pool } = require("pg");
require("dotenv").config({ path: "./src/.env" });

const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: String(process.env.DB_PASSWORD), // Ensure it's a string
  port: process.env.DB_PORT,
  ssl : false,
});

pool
  .connect()
  .then(() => console.log("✅ Database connected successfully!"))
  .catch((err) => console.error("❌ Database connection error:", err));

module.exports = pool;