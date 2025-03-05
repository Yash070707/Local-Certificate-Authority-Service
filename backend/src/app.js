const express = require('express');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const certificateRoutes = require('./routes/certificates');
require('dotenv').config();


console.log("DB User:", process.env.DB_USER); // Debugging
console.log("DB Password:", process.env.DB_PASSWORD);


const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use('/api/auth', authRoutes);
app.use('/api/certificate', certificateRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));