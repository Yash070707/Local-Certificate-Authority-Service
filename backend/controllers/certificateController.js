const pool = require("../config/db");
const forge = require("node-forge");
const fs = require("fs"); // Synchronous fs for existsSync
const fsPromises = require("fs").promises; // Promise-based fs
const path = require("path");
const { exec } = require("child_process");
const nodemailer = require("nodemailer");

const CSR_DIR = path.join(__dirname, "../csr_files");
const CERT_DIR = path.join(__dirname, "../certificates");
const CA_CERT_PATH = path.join(__dirname, "../certs/ca-cert.pem");
const CA_KEY_PATH = path.join(__dirname, "../certs/ca-key.pem");

// Ensure CSR and Certificate directories exist
if (!fs.existsSync(CSR_DIR)) {
  fs.mkdirSync(CSR_DIR, { recursive: true });
}
if (!fs.existsSync(CERT_DIR)) {
  fs.mkdirSync(CERT_DIR, { recursive: true });
}

// Configure Nodemailer
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

exports.generateCSR = async (req, res) => {
  try {
    const {
      domain,
      company,
      division,
      city,
      state,
      country,
      email,
      rootLength,
      username,
    } = req.body;

    if (
      !domain ||
      !company ||
      !division ||
      !city ||
      !state ||
      !country ||
      !email ||
      !rootLength ||
      !username
    ) {
      return res
        .status(400)
        .json({ success: false, message: "Missing required fields" });
    }

    // Fetch user ID from the database
    const userCheck = await pool.query(
      "SELECT id FROM users WHERE username = $1",
      [username]
    );
    if (userCheck.rowCount === 0) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }
    const user_id = userCheck.rows[0].id;

    // Define CSR file paths
    const csrFilePath = path.join(CSR_DIR, `csr_${domain}.pem`);
    const privateKeyPath = path.join(CSR_DIR, `${domain}-private.key`);

    // OpenSSL command to generate CSR
    const opensslCmd = `openssl req -new -newkey rsa:${rootLength} -nodes -keyout "${privateKeyPath}" -out "${csrFilePath}" -subj "/C=${country}/ST=${state}/L=${city}/O=${company}/OU=${division}/CN=${domain}/emailAddress=${email}"`;

    exec(opensslCmd, async (error, stdout, stderr) => {
      if (error) {
        console.error("Error executing OpenSSL:", stderr);
        return res.status(500).json({
          success: false,
          message: "CSR generation failed",
          error: stderr,
        });
      }

      try {
        // Read CSR
        const csrContent = await fsPromises.readFile(csrFilePath, "utf8");

        // Delete private key immediately for security
        if (fs.existsSync(privateKeyPath)) {
          fs.unlinkSync(privateKeyPath);
          console.log(`Deleted private key: ${privateKeyPath}`);
        }

        // Insert CSR details into the database
        const insertQuery = `
          INSERT INTO csr_requests (user_id, domain, company, division, city, state, country, email, root_length, csr, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending') 
          RETURNING id, domain, status, created_at;
        `;
        const values = [
          user_id,
          domain,
          company,
          division,
          city,
          state,
          country,
          email,
          rootLength,
          csrContent,
        ];

        const result = await pool.query(insertQuery, values);

        res.status(201).json({
          success: true,
          message: "CSR generated successfully",
          csrFile: `csr_${domain}.pem`,
          csr: csrContent,
          data: result.rows[0],
        });
      } catch (readError) {
        console.error("Error reading CSR:", readError);
        res
          .status(500)
          .json({ success: false, message: "Error reading generated CSR" });
      }
    });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ success: false, message: "Internal server error" });
  }
};

exports.submitCSR = async (req, res) => {
  const {
    domain,
    company,
    division,
    city,
    state,
    country,
    email,
    root_length,
    csr,
  } = req.body;
  const userId = req.user.id;

  try {
    // Attempt to parse CSR to validate format before saving
    try {
      const csrObj = forge.pki.certificationRequestFromPem(csr);
      if (!csrObj.verify()) {
        return res.status(400).json({
          success: false,
          message: "Invalid CSR: signature verification failed",
        });
      }
    } catch (csrError) {
      console.error("Error parsing CSR:", csrError);
      return res.status(400).json({
        success: false,
        message: "Invalid CSR format",
      });
    }

    const result = await pool.query(
      `INSERT INTO csr_requests (user_id, domain, company, division, city, state, country, email, root_length, csr, status)
       VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending')
       RETURNING id, domain, status, created_at`,
      [
        userId,
        domain,
        company,
        division,
        city,
        state,
        country,
        email,
        root_length,
        csr,
      ]
    );

    // Save CSR to file
    const csrFilePath = path.join(CSR_DIR, `csr_${result.rows[0].id}.pem`);
    await fsPromises.writeFile(csrFilePath, csr);

    res.status(201).json({ success: true, data: result.rows[0] });
  } catch (error) {
    console.error("Error submitting CSR:", error);
    res.status(500).json({ success: false, message: "Error submitting CSR" });
  }
};

exports.downloadFile = (req, res) => {
  const filePath = path.join(CSR_DIR, req.params.filename);

  if (fs.existsSync(filePath)) {
    res.download(filePath, (err) => {
      if (err) {
        console.error("Error downloading file:", err);
        res
          .status(500)
          .json({ success: false, message: "Error downloading file" });
      }
    });
  } else {
    console.log(`File not found: ${filePath}`);
    res.status(404).json({ success: false, message: "File not found" });
  }
};

exports.getUserCSRs = async (req, res) => {
  try {
    const userId = req.user.id;
    const csrs = await pool.query(
      `SELECT c.id, c.domain, c.csr, c.status, c.rejection_reason, c.created_at
       FROM csr_requests c
       WHERE c.user_id = $1`,
      [userId]
    );
    res.json({ success: true, data: csrs.rows });
  } catch (error) {
    console.error("Error fetching user CSRs:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching user CSRs" });
  }
};

exports.getIssuedCertificates = async (req, res) => {
  try {
    const userId = req.user.id;
    const certificates = await pool.query(
      `SELECT ic.id, ic.domain, ic.certificate, ic.status, ic.issued_at, ic.valid_till
       FROM issued_certificates ic
       WHERE ic.user_id = $1`,
      [userId]
    );
    res.json({ success: true, data: certificates.rows });
  } catch (error) {
    console.error("Error fetching issued certificates:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching issued certificates" });
  }
};

exports.getPendingCSRs = async (req, res) => {
  try {
    const csrs = await pool.query(
      `SELECT c.id, c.domain, c.csr, c.status, c.rejection_reason, u.username, u.email
       FROM csr_requests c
       JOIN users u ON c.user_id = u.id
       WHERE c.status = 'pending'`
    );
    res.json({ success: true, data: csrs.rows });
  } catch (error) {
    console.error("Error fetching pending CSRs:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending CSRs" });
  }
};

exports.getAllCSRs = async (req, res) => {
  try {
    const csrs = await pool.query(
      `SELECT c.id, c.domain, c.csr, c.status, c.rejection_reason, u.username, u.email
       FROM csr_requests c
       JOIN users u ON c.user_id = u.id`
    );
    res.json({ success: true, data: csrs.rows });
  } catch (error) {
    console.error("Error fetching all CSRs:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching all CSRs" });
  }
};

exports.approveCSR = async (req, res) => {
  const { csrId } = req.params;
  try {
    // Fetch CSR details including email and username
    const csrResult = await pool.query(
      `SELECT c.*, u.email, u.username 
       FROM csr_requests c 
       JOIN users u ON c.user_id = u.id 
       WHERE c.id = $1 AND c.status = 'pending'`,
      [csrId]
    );

    if (csrResult.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: "CSR not found or already processed",
      });
    }

    const { id, domain, csr, user_id, email, username } = csrResult.rows[0];

    // Update CSR status to approved
    await pool.query(
      `UPDATE csr_requests SET status = 'approved'
       WHERE id = $1
       RETURNING id, domain, status`,
      [csrId]
    );

    // Read CA certificate and key
    let caCertPem, caKeyPem;
    try {
      caCertPem = await fsPromises.readFile(CA_CERT_PATH, "utf8");
      caKeyPem = await fsPromises.readFile(CA_KEY_PATH, "utf8");
    } catch (fileError) {
      console.error("Error reading CA files:", fileError);
      throw new Error("CA certificate or key not found");
    }

    // Parse CA certificate and key
    let caCert, caKey;
    try {
      caCert = forge.pki.certificateFromPem(caCertPem);
      caKey = forge.pki.privateKeyFromPem(caKeyPem);
    } catch (parseError) {
      console.error("Error parsing CA certificate or key:", parseError);
      throw new Error("Invalid CA certificate or key format");
    }

    // Parse CSR
    let csrObj;
    try {
      csrObj = forge.pki.certificationRequestFromPem(csr);
    } catch (csrError) {
      console.error("Error parsing CSR:", csrError);
      throw new Error("Invalid CSR format");
    }

    // Verify CSR
    if (!csrObj.verify()) {
      throw new Error("Invalid CSR signature");
    }

    // Create new certificate
    const cert = forge.pki.createCertificate();
    cert.publicKey = csrObj.publicKey;
    cert.serialNumber = Date.now().toString();
    cert.validity.notBefore = new Date();
    cert.validity.notAfter = new Date();
    cert.validity.notAfter.setFullYear(
      cert.validity.notBefore.getFullYear() + 1
    );

    // Set subject from CSR
    cert.setSubject(csrObj.subject.attributes);

    // Set issuer from CA
    cert.setIssuer(caCert.subject.attributes);

    // Set extensions
    cert.setExtensions([
      {
        name: "basicConstraints",
        cA: false,
      },
      {
        name: "keyUsage",
        digitalSignature: true,
        keyEncipherment: true,
      },
      {
        name: "extKeyUsage",
        serverAuth: true,
      },
      {
        name: "subjectAltName",
        altNames: [
          {
            type: 2, // DNS
            value: domain,
          },
        ],
      },
    ]);

    // Sign certificate with CA key
    cert.sign(caKey, forge.md.sha256.create());

    // Convert to PEM
    const certPem = forge.pki.certificateToPem(cert);

    // Insert into issued_certificates
    const issuedCert = await pool.query(
      `INSERT INTO issued_certificates (user_id, csr_id, domain, certificate, status, valid_till)
       VALUES ($1, $2, $3, $4, 'active', $5)
       RETURNING id, domain, issued_at, valid_till`,
      [user_id, id, domain, certPem, new Date(cert.validity.notAfter)]
    );

    // Save certificate to file
    const certFilePath = path.join(CERT_DIR, `cert_${id}.pem`);
    await fsPromises.writeFile(certFilePath, certPem);

    // Send email notification
    await sendCertificateApprovalEmail(
      email,
      username,
      domain,
      issuedCert.rows[0].id
    );

    res.json({
      success: true,
      message: "CSR approved and certificate issued",
      data: issuedCert.rows[0],
    });
  } catch (error) {
    console.error("Error approving CSR:", error);
    res.status(500).json({
      success: false,
      message: "Error approving CSR",
      error: error.message,
    });
  }
};

exports.rejectCSR = async (req, res) => {
  try {
    const { csrId } = req.params;
    const { reason = "No reason provided" } = req.body;

    // Get CSR details
    const csrResult = await pool.query(
      `SELECT c.*, u.email, u.username FROM csr_requests c JOIN users u ON c.user_id = u.id WHERE c.id = $1 AND c.status = 'pending'`,
      [csrId]
    );

    if (csrResult.rowCount === 0) {
      return res.status(404).json({
        success: false,
        message: "CSR not found or already processed",
      });
    }

    const csrData = csrResult.rows[0];

    // Update CSR status to rejected
    const rejectedCsr = await pool.query(
      "UPDATE csr_requests SET status = 'rejected', rejection_reason = $1 WHERE id = $2 RETURNING id, domain, status, rejection_reason",
      [reason, csrId]
    );

    // Send rejection email
    await sendCertificateRejectionEmail(
      csrData.email,
      csrData.username,
      csrData.domain,
      reason
    );

    res.json({
      success: true,
      message: "CSR rejected successfully",
      data: rejectedCsr.rows[0],
    });
  } catch (error) {
    console.error("Error rejecting CSR:", error);
    res.status(500).json({ success: false, message: "Error rejecting CSR" });
  }
};

async function sendCertificateApprovalEmail(
  email,
  username,
  domain,
  certificateId
) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `Certificate Issued for ${domain}`,
      html: `
        <h2>Certificate Issued</h2>
        <p>Dear ${username},</p>
        <p>Your CSR for domain <strong>${domain}</strong> has been approved, and a certificate has been issued.</p>
        <p>Certificate ID: ${certificateId}</p>
        <p>Please log in to your dashboard to download the certificate.</p>
        <p>Best regards,<br>Certificate Authority Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Approval email sent to ${email} for domain ${domain}`);
  } catch (error) {
    console.error("Error sending approval email:", error);
  }
}

async function sendCertificateRejectionEmail(email, username, domain, reason) {
  try {
    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: `CSR Rejected for ${domain}`,
      html: `
        <h2>CSR Rejected</h2>
        <p>Dear ${username},</p>
        <p>Your CSR for domain <strong>${domain}</strong> has been rejected.</p>
        <p>Reason: ${reason}</p>
        <p>Please contact the Certificate Authority for further details or submit a new CSR.</p>
        <p>Best regards,<br>Certificate Authority Team</p>
      `,
    };

    await transporter.sendMail(mailOptions);
    console.log(`Rejection email sent to ${email} for domain ${domain}`);
  } catch (error) {
    console.error("Error sending rejection email:", error);
  }
}

module.exports = exports;