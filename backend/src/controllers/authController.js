const pool = require('../config/db');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
JWT_SECRET="abhiyashwani2021"


exports.signup = async (req, res) => {
  const { username, password, role = 'client' } = req.body;  // Default role to 'client'
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (username, password, role) VALUES ($1, $2, $3) RETURNING id, role';
    const result = await pool.query(query, [username, hashedPassword, role]);

    res.status(201).json({ 
      message: 'User registered successfully', 
      userId: result.rows[0].id, 
      role: result.rows[0].role 
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};


exports.signin = async (req, res) => {
  const { username, password } = req.body;
  try {
    const query = 'SELECT * FROM users WHERE username = $1';
    const result = await pool.query(query, [username]);

    if (result.rows.length === 0) return res.status(401).json({ error: 'Invalid credentials' });

    const user = result.rows[0];
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) return res.status(401).json({ error: 'Invalid credentials' });

    const token = jwt.sign(
      { id: user.id, username: user.username, role: user.role },  
      JWT_SECRET,
      { expiresIn: '1h' }
    );

    res.json({ message: 'Login successful', token });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
