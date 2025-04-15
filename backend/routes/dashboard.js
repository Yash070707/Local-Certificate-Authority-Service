const express = require('express');
const { getUserCertificates } = require('../controllers/dashboardController');

const router = express.Router();

// Route to fetch user certificates
router.get('/UserCertificates', getUserCertificates);

module.exports = router;