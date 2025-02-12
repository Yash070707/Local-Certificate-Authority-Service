const express = require('express');
const router = express.Router();
const { createCSR } = require('../controllers/certificateController');
const { authenticateToken } = require('../middleware/auth');


router.post('/generate-csr', authenticateToken, createCSR);

module.exports = router;


