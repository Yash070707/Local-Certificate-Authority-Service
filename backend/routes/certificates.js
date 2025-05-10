const express = require("express");
const {
  generateCSR,
  downloadFile,
  getPendingCSRs,
  approveCSR,
  rejectCSR,
  getUserCSRs,
  getIssuedCertificates,
} = require("../controllers/certificateController");
const { authenticateToken, authorizeAdmin } = require("../middleware/auth");

const router = express.Router();

router.post("/generate-csr", authenticateToken, generateCSR);
router.get("/download/csr/:filename", authenticateToken, downloadFile);
router.get("/csrs", authenticateToken, getUserCSRs);
router.get("/issued", authenticateToken, getIssuedCertificates);
router.get("/pending-csrs", authenticateToken, authorizeAdmin, getPendingCSRs);
router.post("/approve-csr", authenticateToken, authorizeAdmin, approveCSR);
router.post("/reject-csr", authenticateToken, authorizeAdmin, rejectCSR);

module.exports = router;
