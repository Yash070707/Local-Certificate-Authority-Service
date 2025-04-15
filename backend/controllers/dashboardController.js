const pool = require('../config/db');

// Controller to fetch all certificates for a user
const getUserCertificates = async (req, res) => {
    try {
        // Extract the username from the request (e.g., from req.query or req.user)
        const username = req.query.username; // Assuming username is sent as a query parameter

        if (!username) {
            return res.status(400).json({ error: 'Username is required' });
        }

        // Query to fetch certificates from the csr_requests table
        const query = `
            SELECT 
                csr_requests.domain AS "Domain Name",
                csr_requests.created_at AS "Issue Date",
                csr_requests.created_at + interval '1 year' AS "Expiry Date",
                'Active' AS "Status" -- You can adjust the status logic as needed
            FROM csr_requests
            INNER JOIN users ON csr_requests.user_id = users.id
            WHERE users.username = $1
            ORDER BY csr_requests.created_at DESC;
        `;

        // Execute the query
        const result = await pool.query(query, [username]);

        // Send the data to the frontend
        res.status(200).json({ success: true, certificates: result.rows });
    } catch (error) {
        console.error('Error fetching certificates:', error);
        res.status(500).json({ success: false, error: 'Failed to fetch certificates' });
    }
};

module.exports = { getUserCertificates };

