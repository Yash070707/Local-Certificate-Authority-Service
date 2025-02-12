const openssl = require('openssl-nodejs');
// const fs = require('fs');
// const path = require('path');
const pool = require('../config/db');
const { generateCSR } = require('../services/opensslService');


exports.createCSR = async (req, res) => {
  try {
    const { commonName, country, state, city, organization, email } = req.body;
    const userId = req.user.id; // Extracted from JWT after authentication

    // Generate CSR and Private Key
    const { csr, privateKey } = await generateCSR({
      commonName,
      country,
      state,
      city,
      organization,
      email
    });

    // Insert CSR into PostgreSQL
    const insertQuery = `
      INSERT INTO csrs (user_id, common_name, organization, country, state, city, email, csr, private_key)
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
      RETURNING id, created_at
    `;

    const result = await pool.query(insertQuery, [
      userId,
      commonName,
      organization,
      country,
      state,
      city,
      email,
      csr,
      privateKey
    ]);

    res.status(201).json({
      message: 'CSR generated and stored successfully',
      csrId: result.rows[0].id,
      createdAt: result.rows[0].created_at,
      csr,
      privateKey
    });
  } catch (error) {
    console.error('CSR Generation Error:', error);
    res.status(500).json({ error: error.message });
  }
};







