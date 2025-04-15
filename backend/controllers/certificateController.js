const pool = require('../config/db');
const fs = require('fs');
const path = require('path');
const { exec } = require("child_process");
const openssl = require('openssl-nodejs');

const CSR_DIR = path.join(__dirname, "csr_files");

// Ensure CSR directory exists
if (!fs.existsSync(CSR_DIR)) {
  fs.mkdirSync(CSR_DIR, { recursive: true });
}

exports.generateCSR = async (req, res) => {
  try {
    const { domain, company, division, city, state, country, email, rootLength, username } = req.body;

    if (!domain || !company || !division || !city || !state || !country || !email || !rootLength || !username) {
      return res.status(400).json({ success: false, message: "Missing required fields" });
    }

    // Fetch user ID from the database
    const userCheck = await pool.query("SELECT id FROM users WHERE username = $1", [username]);
    if (userCheck.rowCount === 0) {
      return res.status(404).json({ success: false, message: "User not found" });
    }
    const user_id = userCheck.rows[0].id;

    // Define CSR file paths
    const csrFilePath = path.join(CSR_DIR, `${domain}.csr`);
    const privateKeyPath = path.join(CSR_DIR, `${domain}-private.key`);

    // OpenSSL command to generate CSR **without storing private key on server**
    const opensslCmd = `openssl req -new -newkey rsa:${rootLength} -nodes -keyout "${privateKeyPath}" -out "${csrFilePath}" -subj "/C=${country}/ST=${state}/L=${city}/O=${company}/OU=${division}/CN=${domain}/emailAddress=${email}"`;

    console.log({ user_id });

    exec(opensslCmd, async (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing OpenSSL:", stderr);
        return res.status(500).json({ success: false, message: "CSR generation failed", error: stderr });
      }

      try {
        // Read CSR (but not the private key)
        const csrContent = fs.readFileSync(csrFilePath, "utf8");

        // Delete private key immediately for security
        if (fs.existsSync(privateKeyPath)) {
          fs.unlinkSync(privateKeyPath);
          console.log(`Deleted private key: ${privateKeyPath}`);
        }

        // Insert CSR details into the database (WITHOUT private key)
        const insertQuery = `
          INSERT INTO csr_requests (user_id, domain, company, division, city, state, country, email, root_length, csr)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *;
        `;
        const values = [user_id, domain, company, division, city, state, country, email, rootLength, csrContent];

        await pool.query(insertQuery, values);

        res.status(201).json({
          success: true,
          message: "CSR generated successfully",
          csrFile: `${domain}.csr`,
          csr: csrContent
        });
        console.log(csrContent);
        console.log(`${domain}.csr`);

      } catch (readError) {
        console.error("Error reading CSR:", readError);
        res.status(500).json({ success: false, message: "Error reading generated CSR" });
      }
    });

  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

// Download CSR
exports.downloadFile = (req, res) => {
  const filePath = path.join(CSR_DIR, req.params.filename);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).json({ success: false, message: "File not found" });
  }
};

exports.signCSR = async (req, res) => {
  try {
      const { csr_id } = req.body;

      if (!csr_id) {
          return res.status(400).json({ success: false, message: "CSR ID is required" });
      }

      // Fetch CSR from the database
      const csrResult = await pool.query("SELECT * FROM csr_requests WHERE id = $1", [csr_id]);

      if (csrResult.rowCount === 0) {
          return res.status(404).json({ success: false, message: "CSR not found" });
      }

      const { user_id, domain, csr } = csrResult.rows[0];

      // Define certificate file path
      const certFilePath = path.join(CSR_DIR, `${domain}.crt`);

      // OpenSSL command to sign the CSR (Using a CA key & cert)
      const caKeyPath = path.join(__dirname, "ca-key.pem"); // Your CA private key
      const caCertPath = path.join(__dirname, "ca-cert.pem"); // Your CA certificate

      const opensslSignCmd = `openssl x509 -req -in "${CSR_DIR}/${domain}.csr" -CA "${caCertPath}" -CAkey "${caKeyPath}" -CAcreateserial -out "${certFilePath}" -days 365 -sha256`;

      exec(opensslSignCmd, async (error, stdout, stderr) => {
          if (error) {
              console.error("Error signing CSR:", stderr);
              return res.status(500).json({ success: false, message: "CSR signing failed", error: stderr });
          }

          try {
              // Read signed certificate
              const certificateContent = fs.readFileSync(certFilePath, "utf8");

              // Store the certificate in the database
              const insertCertQuery = `
                  INSERT INTO issued_certificates (user_id, csr_id, domain, certificate)
                  VALUES ($1, $2, $3, $4) RETURNING *;
              `;
              await pool.query(insertCertQuery, [user_id, csr_id, domain, certificateContent]);

              res.status(201).json({
                  success: true,
                  message: "CSR signed successfully",
                  certificateFile: `${domain}.crt`,
                  certificate: certificateContent
              });

          } catch (readError) {
              console.error("Error reading certificate:", readError);
              res.status(500).json({ success: false, message: "Error reading signed certificate" });
          }
      });

  } catch (error) {
      console.error("Error:", error);
      res.status(500).json({ success: false, message: "Internal server error" });
  }
};


exports.downloadCertificate = (req, res) => {
  const { filename } = req.params;
  const certFilePath = path.join(CSR_DIR, filename);

  if (fs.existsSync(certFilePath)) {
      res.download(certFilePath);
  } else {
      res.status(404).json({ success: false, message: "Certificate not found" });
  }
};
