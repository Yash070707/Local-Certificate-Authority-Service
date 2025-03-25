const express = require("express");
const {
  generateCSR,
  signCSR,
  downloadFile,
  downloadCertificate
} = require("../controllers/certificateController");

const router = express.Router();

// Route to generate CSR
router.post("/generate-csr", generateCSR);

// Route to sign CSR and issue certificate
router.post("/sign-csr", signCSR);

// Route to download CSR file
router.get("/download/csr/:filename", downloadFile);

// Route to download issued certificate
router.get("/download/certificate/:filename", downloadCertificate);

module.exports = router;
