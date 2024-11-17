const { Pool } = require("pg"); // Import Pool from pg

// Create a connection pool
const pool = new Pool({
  host: "localhost", // PostgreSQL server host
  user: "postgres", // Your PostgreSQL username
  password: "ca_password123", // Your PostgreSQL password
  database: "CA_DB", // Your PostgreSQL database name
  port: 5432, // Default PostgreSQL port
  max: 10, // Maximum number of connections
  idleTimeoutMillis: 30000, // Close idle clients after 30 seconds
  connectionTimeoutMillis: 2000, // Return error if connection takes more than 2 seconds
});

module.exports = pool; // Export the pool
