const express = require("express");
const router = express.Router();
const {
  getPendingCSRs,
  getAllCSRs,
  getUserCSRs,
  getIssuedCertificates,
  approveCSR,
  rejectCSR,
  submitCSR,
  generateCSR,
  downloadFile,
  downloadCertificate,
} = require("../controllers/certificateController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

router.post("/generate-csr", authenticateToken, generateCSR);
router.post("/submit", authenticateToken, submitCSR);
router.get("/download/:filename", authenticateToken, downloadFile);
router.get("/download-cert/:certId", authenticateToken, downloadCertificate);
router.get("/pending-csrs", authenticateToken, authorizeAdmin, getPendingCSRs);
router.get("/all-csrs", authenticateToken, authorizeAdmin, getAllCSRs);
router.get("/csrs", authenticateToken, getUserCSRs);
router.get("/issued", authenticateToken, getIssuedCertificates);
router.post("/approve/:csrId", authenticateToken, authorizeAdmin, approveCSR);
router.post("/reject/:csrId", authenticateToken, authorizeAdmin, rejectCSR);

module.exports = router;