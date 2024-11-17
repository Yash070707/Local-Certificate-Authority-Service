const pool = require('../config/db');
// const bcrypt = require('bcrypt'); // Install bcrypt for password hashing: npm install bcrypt

exports.login = async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        return res.status(400).json({ message: 'Email and password are required' });
    }

    try {
        // Query the database for the user
        const result = await pool.query('SELECT * FROM users WHERE email = $1', [email]);

        if (result.rows.length === 0) {
            return res.status(404).json({ message: 'User not found' });
        }

        const user = result.rows[0];

        // Compare the provided password with the hashed password in the database
        const isMatch = (password==user.password)

        if (!isMatch) {
            return res.status(401).json({ message: 'Invalid credentials' });
        }

        // Extract user role
        const { role } = user;

        // Send response with user ID and role
        res.json({ 
            message: 'Login successful', 
            userId: user.id, 
            role 
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
};
