const express = require('express');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const certificateRoutes = require('./routes/certificates');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/certificate', certificateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));