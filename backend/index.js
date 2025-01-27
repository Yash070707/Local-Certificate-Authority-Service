const express = require('express');
const cors = require('cors'); // Import cors
const routes = require('./routes/index'); // Importing routes

const app = express();
const PORT = process.env.PORT || 8000;

// Middleware to handle CORS
app.use(cors());



// Gaurav was here


// Middleware to parse JSON requests
app.use(express.json());







// Static files
app.use(express.static('public'));

// Routes
app.use('/api', routes);

// Starting the server
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
