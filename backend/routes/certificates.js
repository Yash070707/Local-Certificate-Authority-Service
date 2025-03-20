const express = require("express");
const { generateCSR, downloadFile } = require("../controllers/certificateController"); // Ensure correct import
//const { authenticateToken } = require("../middleware/auth");

const router = express.Router();

router.post("/generate-csr", generateCSR);
router.get("/download/:filename", downloadFile); // Ensure downloadFile is correctly imported

module.exports = router;
