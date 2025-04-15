const express = require('express');
const authRoutes = require('./routes/auth');
const bodyParser = require('body-parser');
const cors = require('cors');
const certificateRoutes = require('./routes/certificates');
const dashboardRoutes = require ('./routes/dashboard');
require('dotenv').config();

const app = express();
app.use(bodyParser.json());
app.use(express.json());

app.use(cors({
    origin:['http://localhost:5173', 'http://127.0.0.1:5173'],
    methods: ['GET', 'POST', 'PUT', 'DELETE'],
    credentials: true
  }));

app.options('/api/auth', (req, res) => {
    res.header('Access-Control-Allow-Origin', 'http://localhost:5173');
    res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    res.sendStatus(200);
});

app.use('/api/auth', authRoutes);
app.use('/api/certificate', certificateRoutes);
app.use('/api/dashboard', dashboardRoutes)

const PORT = process.env.PORT;
app.listen(PORT, () => console.log(`✅ Server running on port ${PORT}`));