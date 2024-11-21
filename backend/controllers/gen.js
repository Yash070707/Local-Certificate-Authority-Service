const { exec } = require('child_process');
const fs = require('fs');
const path = require('path');

exports.generate_report=async (req, res) => {
    const {
        countryName,
        stateOrProvinceName,
        localityName,
        organizationName,
        organizationalUnitName,
        commonName,
        emailAddress,
        challengePassword,
        optionalCompanyName
    } = req.body;

    // Validate required fields
    if (!countryName || !stateOrProvinceName || !localityName || !organizationName || !commonName) {
        return res.status(400).json({ message: 'Required fields are missing' });
    }

    try {
        // Paths for the key and CSR
        const keyPath = path.join(__dirname, 'example.org.key');
        const csrPath = path.join(__dirname, 'example.org.csr');
        console.log(keyPath)
        console.log(csrPath)
        // Generate a private key
        exec(`openssl genrsa -out ${keyPath} 2048`, (keyErr) => {
            if (keyErr) {
                console.error(keyErr);
                return res.status(500).json({ message: 'Error generating private key' });
            }

            // Generate the CSR
            const command = `
    openssl req -new -key "${keyPath.replace(/\\/g, '/')}" -out "${csrPath.replace(/\\/g, '/')}" \
    -subj "/C=${countryName}/ST=${stateOrProvinceName}/L=${localityName}/O=${organizationName}${organizationalUnitName ? `/OU=${organizationalUnitName}` : ''}/CN=${commonName}${emailAddress ? `/emailAddress=${emailAddress}` : ''}"
`;

            console.log(command)

            exec(command, (csrErr) => {
                if (csrErr) {
                    console.error(csrErr);
                    return res.status(500).json({ message: 'Error generating CSR' });
                }

                // Read and return the generated CSR
                fs.readFile(csrPath, 'utf8', (readErr, csr) => {
                    if (readErr) {
                        console.error(readErr);
                        return res.status(500).json({ message: 'Error reading CSR file' });
                    }

                    res.json({ message: 'CSR generated successfully', csr });
                });
            });
        });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Internal server error' });
    }
}