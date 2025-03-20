
const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const openssl = require('openssl-nodejs');


const CSR_DIR = path.join(__dirname, "csr_files");

// Ensure CSR directory exists
if (!fs.existsSync(CSR_DIR)) {
  fs.mkdirSync(CSR_DIR);
}

exports.generateCSR = async (req, res) => {
  try {
    
    const { domain, company, division, city, state, country, email, rootLength, username } = req.body;
    //const username = req.user.username; // Extracted from JWT middleware

    if (!domain || !company || !division || !city || !state || !country || !email || !rootLength || !username) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch user ID from database
    const userCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user_id = userCheck.rows[0].id;

    // Define file paths
    
    const privateKeyPath = path.join(CSR_DIR, `${domain}-private.key`);
    const csrFilePath = path.join(CSR_DIR, `${domain}.csr`);

    // OpenSSL command to generate CSR and Private Key
    const opensslCmd = `openssl req -new -newkey rsa:${rootLength} -nodes -keyout "${privateKeyPath}" -out "${csrFilePath}" -subj "/C=${country}/ST=${state}/L=${city}/O=${company}/OU=${division}/CN=${domain}/emailAddress=${email}"`;
    console.log({user_id});
    exec(opensslCmd, async (error, stdout, stderr) => {
      if (error) {
        console.log("problem here in exec");
        return res.status(500).json({ success: false, message: "CSR generation failed in exec", error: stderr });
      }

      // Read CSR and Private Key
      const csrContent = fs.readFileSync(csrFilePath, "utf8");
      const privateKeyContent = fs.readFileSync(keyFilePath, "utf8");

      // Insert CSR details into the database
      const insertQuery = `
        INSERT INTO csr_requests (user_id, domain, company, division, city, state, country, email, root_length, csr, private_key)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11) RETURNING *;
      `;
      const values = [user_id, domain, company, division, city, state, country, email, rootLength, csrContent, privateKeyContent];

      await pool.query(insertQuery, values);

      res.status(201).json({
        success: true,
        message: "CSR generated successfully",
        csrFile: `${domain}.csr`,
        privateKeyFile: `${domain}.key`,
        csr: csrContent,
        privateKey: privateKeyContent
      });
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Download CSR or Private Key
exports.downloadFile = (req, res) => {
  const filePath = path.join(CSR_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ success: false, message: "File not found" });
  }
};
