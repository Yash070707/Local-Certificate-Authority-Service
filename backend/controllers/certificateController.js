const pool = require("../config/db");
const fs = require("fs");
const path = require("path");
const { exec } = require("child_process");
const nodemailer = require("nodemailer");

const CSR_DIR = path.join(__dirname, "../../csr_files");
const CERT_DIR = path.join(__dirname, "../../certificates");

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
    pass: process.env.EMAIL_PASSWORD, // Changed from EMAIL_PASS
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
    const csrFilePath = path.join(CSR_DIR, `${domain}.csr`);
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
        const csrContent = fs.readFileSync(csrFilePath, "utf8");

        // Delete private key immediately for security
        if (fs.existsSync(privateKeyPath)) {
          fs.unlinkSync(privateKeyPath);
          console.log(`Deleted private key: ${privateKeyPath}`);
        }

        // Insert CSR details into the database
        const insertQuery = `
          INSERT INTO csr_requests (user_id, domain, company, division, city, state, country, email, root_length, csr, status)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'pending') RETURNING *;
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

        await pool.query(insertQuery, values);

        res.status(201).json({
          success: true,
          message: "CSR generated successfully",
          csrFile: `${domain}.csr`,
          csr: csrContent,
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
    const userCSRs = await pool.query(
      "SELECT * FROM csr_requests WHERE user_id = $1",
      [userId]
    );
    res.json({ success: true, data: userCSRs.rows });
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
      "SELECT * FROM issued_certificates WHERE user_id = $1",
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
    const pendingCSRs = await pool.query(
      "SELECT csr.*, u.username, u.email FROM csr_requests csr JOIN users u ON csr.user_id = u.id WHERE csr.status = 'pending'"
    );
    res.json({ success: true, data: pendingCSRs.rows });
  } catch (error) {
    console.error("Error fetching pending CSRs:", error);
    res
      .status(500)
      .json({ success: false, message: "Error fetching pending CSRs" });
  }
};

exports.approveCSR = async (req, res) => {
  try {
    const { csr_id, validity_days = 365 } = req.body;

    // Get CSR details
    const csrResult = await pool.query(
      "SELECT csr.*, u.email, u.username FROM csr_requests csr JOIN users u ON csr.user_id = u.id WHERE csr.id = $1",
      [csr_id]
    );

    if (csrResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "CSR not found" });
    }

    const csrData = csrResult.rows[0];

    // Sign the CSR
    const certFilePath = path.join(CERT_DIR, `${csrData.domain}.crt`);
    const caKeyPath = path.join(__dirname, "../../ca-key.pem");
    const caCertPath = path.join(__dirname, "../../ca-cert.pem");

    // Write CSR to temporary file
    const tempCSRPath = path.join(CSR_DIR, `temp-${csrData.domain}.csr`);
    fs.writeFileSync(tempCSRPath, csrData.csr);

    const opensslSignCmd = `openssl x509 -req -in "${tempCSRPath}" -CA "${caCertPath}" -CAkey "${caKeyPath}" -CAcreateserial -out "${certFilePath}" -days ${validity_days} -sha256`;

    exec(opensslSignCmd, async (error, stdout, stderr) => {
      try {
        // Clean up temp file
        fs.unlinkSync(tempCSRPath);

        if (error) {
          console.error("Error signing CSR:", stderr);
          return res.status(500).json({
            success: false,
            message: "CSR signing failed",
            error: stderr,
          });
        }

        // Read signed certificate
        const certificateContent = fs.readFileSync(certFilePath, "utf8");
        const validTill = new Date(
          Date.now() + validity_days * 24 * 60 * 60 * 1000
        );

        // Store in issued_certificates table
        const insertCertQuery = `
          INSERT INTO issued_certificates (user_id, csr_id, domain, certificate, valid_till, status)
          VALUES ($1, $2, $3, $4, $5, 'active') RETURNING *;
        `;
        const certResult = await pool.query(insertCertQuery, [
          csrData.user_id,
          csr_id,
          csrData.domain,
          certificateContent,
          validTill,
        ]);

        // Update CSR status
        await pool.query(
          "UPDATE csr_requests SET status = 'approved' WHERE id = $1",
          [csr_id]
        );

        // Send email notification
        await sendCertificateApprovalEmail(
          csrData.email,
          csrData.username,
          csrData.domain,
          certResult.rows[0].id
        );

        res.json({
          success: true,
          message: "CSR approved and certificate issued",
          certificate: {
            id: certResult.rows[0].id,
            domain: csrData.domain,
            validTill,
          },
        });
      } catch (err) {
        console.error("Error in certificate issuance:", err);
        res
          .status(500)
          .json({ success: false, message: "Error in certificate issuance" });
      }
    });
  } catch (error) {
    console.error("Error approving CSR:", error);
    res.status(500).json({ success: false, message: "Error approving CSR" });
  }
};

exports.rejectCSR = async (req, res) => {
  try {
    const { csr_id, reason = "No reason provided" } = req.body;

    // Get CSR details
    const csrResult = await pool.query(
      "SELECT csr.*, u.email, u.username FROM csr_requests csr JOIN users u ON csr.user_id = u.id WHERE csr.id = $1",
      [csr_id]
    );

    if (csrResult.rowCount === 0) {
      return res.status(404).json({ success: false, message: "CSR not found" });
    }

    const csrData = csrResult.rows[0];

    // Update CSR status to rejected
    await pool.query(
      "UPDATE csr_requests SET status = 'rejected' WHERE id = $1",
      [csr_id]
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
