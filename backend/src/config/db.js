const { Pool } = require('pg');
require('dotenv').config();

const pool = new Pool({
  user: 'postgres',
  host: 'localhost',
  database: 'ca_db',
  password: 'Gau@postgre#2025',
  port: process.env.DB_PORT,
});

pool.connect()
    .then(() => console.log('✅ Database connected successfully!'))
    .catch(err => console.error('❌ Database connection error:', err))
;

module.exports = pool;