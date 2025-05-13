# Local Certificate Authority Service

[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

The Local Certificate Authority Service is an open-source web application designed for managing Certificate Signing Requests (CSRs) and issuing X.509 certificates within an enterprise Public Key Infrastructure (PKI). It offers a user-friendly interface for submitting CSRs, administrative workflows for approval and rejection, and certificate issuance, complete with email notifications for key actions. This project serves as a partial implementation of a Certificate Authority (CA) and Registration Authority (RA) as outlined in a broader CA service specification.

**Note:** This project was developed as a prototype and does not include advanced features like OCSP, CRL, multi-PKI support, or HSM integration due to time constraints. It is suitable for educational purposes or small-scale PKI deployments.

## Features

**User Dashboard:**

* Register and verify email with OTP.
* Generate and submit CSRs with customizable attributes (domain, company, etc.).
* View and download CSRs and issued certificates.
* Check dashboard stats (total CSRs, pending, approved, active certificates).

**Admin Dashboard:**

* View all/pending CSRs.
* Approve or reject CSRs with email notifications.
* View admin stats (total CSRs, pending, approved, active certificates).

**Certificate Management:**

* Generate CSRs using OpenSSL.
* Issue X.509 v3 certificates signed by a CA.
* Store certificates and track revocation (basic).

**Security:**

* JWT-based authentication.
* Role-based access (admin vs. client).
* Email notifications for signup, password reset, and CSR approval/rejection.

**Tech Stack:**

* **Backend:** Node.js, Express, PostgreSQL, node-forge, nodemailer, openssl-nodejs.
* **Frontend:** React, Material-UI, Axios, Formik, Yup.
* **Database:** PostgreSQL (`ca_db`).

## Prerequisites

Before setting up the project, ensure you have the following installed:

* **Node.js (>= 18.x):** [Download](https://nodejs.org/)
* **PostgreSQL (>= 14.x):** [Download](https://www.postgresql.org/download/)
* **OpenSSL (>= 3.x):**
    * **Ubuntu:** `sudo apt-get install openssl`
    * **macOS:** `brew install openssl`
    * **Windows:** [Install via OpenSSL for Windows](https://slproweb.com/products/Win32OpenSSL.html)
* **Gmail Account:** For SMTP email service (or another SMTP provider).
* **Git:** To clone the repository.

## Installation

```bash
# Clone the Repository
git clone [https://github.com/imabhi7/Local-Certificate-Authority-Service.git](https://github.com/imabhi7/Local-Certificate-Authority-Service.git)
cd Local-Certificate-Authority-Service

# Set Up the Backend
cd backend
npm install

# Create .env file
cp .env.example .env

# Edit .env with your values:
# PORT=5000
# DB_HOST=localhost
# DB_USER=postgres
# DB_PASSWORD=your_postgres_password
# DB_NAME=ca_db
# DB_PORT=5432
# JWT_SECRET=your_secure_jwt_secret
# EMAIL_USER=your_email@gmail.com
# EMAIL_PASSWORD=your_gmail_app_password
# CA_CERT_PATH=certs/ca-cert.pem
# CA_KEY_PATH=certs/ca-key.pem

# Generate a Gmail app-specific password:
# 1. Go to Google Account Settings.
# 2. Enable 2-Step Verification.
# 3. Under "Signing in to Google," select "App passwords."
# 4. Generate a password for "Mail" and use it as EMAIL_PASSWORD.

# JWT_SECRET: Use a random, secure string (e.g., openssl rand -hex 32).

# Generate CA Certificate and Key:
mkdir certs
openssl genrsa -out certs/ca-key.pem 2048
openssl req -x509 -new -nodes -key certs/ca-key.pem -sha256 -days 3650 -out certs/ca-cert.pem -subj "/C=IN/ST=Punjab/L=Rupnagar/O=CA Service/OU=IT/CN=Local CA/emailAddress=ca@example.com"

# Ensure CA_CERT_PATH and CA_KEY_PATH in .env point to certs/ca-cert.pem and certs/ca-key.pem.

# Set Up the Database
# Install and start PostgreSQL (follow OS-specific instructions).

# Create the database:
psql -U postgres -c "CREATE DATABASE ca_db;"

# Save the following SQL to backend/db_schema.sql:
# -- Create users table
# CREATE TABLE IF NOT EXISTS public.users (
#     id integer NOT NULL DEFAULT nextval('users_id_seq'::regclass),
#     username character varying(255) NOT NULL,
#     email character varying(255) NOT NULL,
#     password character varying(255) NOT NULL,
#     role character varying(50) DEFAULT 'client'::character varying,
#     is_verified boolean DEFAULT false,
#     otp character varying(6),
#     otp_expiry timestamp without time zone,
#     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
#     updated_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
#     CONSTRAINT users_pkey PRIMARY KEY (id),
#     CONSTRAINT users_email_key UNIQUE (email),
#     CONSTRAINT users_username_key UNIQUE (username)
# );
# CREATE INDEX IF NOT EXISTS idx_users_email ON public.users USING btree (email);
# -- Create csr_requests table
# CREATE TABLE IF NOT EXISTS public.csr_requests (
#     id integer NOT NULL DEFAULT nextval('csr_requests_id_seq'::regclass),
#     user_id integer NOT NULL,
#     domain character varying(255) NOT NULL,
#     company character varying(255) NOT NULL,
#     division character varying(255) NOT NULL,
#     city character varying(100) NOT NULL,
#     state character varying(100) NOT NULL,
#     country character varying(10) NOT NULL,
#     email character varying(255) NOT NULL,
#     root_length integer NOT NULL,
#     csr text NOT NULL,
#     created_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
#     status character varying(20) DEFAULT 'pending'::character varying,
#     rejection_reason text,
#     CONSTRAINT csr_requests_pkey PRIMARY KEY (id),
#     CONSTRAINT csr_requests_user_id_fkey FOREIGN KEY (user_id)
#     REFERENCES public.users (id) ON DELETE CASCADE
# );
# -- Create issued_certificates table
# CREATE TABLE IF NOT EXISTS public.issued_certificates (
#     id integer NOT NULL DEFAULT nextval('issued_certificates_id_seq'::regclass),
#     user_id integer,
#     csr_id integer,
#     domain character varying(255) NOT NULL,
#     certificate text NOT NULL,
#     issued_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
#     valid_till timestamp without time zone,
#     status character varying(20) DEFAULT 'active'::character varying,
#     CONSTRAINT issued_certificates_pkey PRIMARY KEY (id),
#     CONSTRAINT issued_certificates_csr_id_fkey FOREIGN KEY (csr_id)
#     REFERENCES public.csr_requests (id) ON DELETE CASCADE,
#     CONSTRAINT issued_certificates_user_id_fkey FOREIGN KEY (user_id)
#     REFERENCES public.users (id) ON DELETE CASCADE
# );
# -- Create revoked_certificates table
# CREATE TABLE IF NOT EXISTS public.revoked_certificates (
#     id integer NOT NULL DEFAULT nextval('revoked_certificates_id_seq'::regclass),
#     certificate_id integer NOT NULL,
#     revoked_at timestamp without time zone DEFAULT CURRENT_TIMESTAMP,
#     reason text,
#     CONSTRAINT revoked_certificates_pkey PRIMARY KEY (id),
#     CONSTRAINT revoked_certificates_certificate_id_fkey FOREIGN KEY (certificate_id)
#     REFERENCES public.issued_certificates (id) ON DELETE CASCADE
# );
# -- Create sequences (if not created automatically):
# CREATE SEQUENCE IF NOT EXISTS users_id_seq;
# CREATE SEQUENCE IF NOT EXISTS csr_requests_id_seq;
# CREATE SEQUENCE IF NOT EXISTS issued_certificates_id_seq;
# CREATE SEQUENCE IF NOT EXISTS revoked_certificates_id_seq;

# Run the schema:
psql -U postgres -d ca_db -f backend/db_schema.sql

# Set up admin and user accounts (backend creates admin on startup):
# Username: admin
# Email: caservice2025@gmail.com
# Password: admin@123
# Role: admin
# Verified: true

# Change the admin password after setup (requires bcrypt extension in PostgreSQL):
# psql -U postgres -d ca_db -c "UPDATE users SET password = crypt('new_admin_password', gen_salt('bf')) WHERE username = 'admin';"

# Create a test user manually:
# psql -U postgres -d ca_db -c "INSERT INTO users (username, email, password, role, is_verified) VALUES ('user1', 'user1@example.com', crypt('user@123', gen_salt('bf')), 'client', true);"

# Set Up the Frontend
cd ../frontend
npm install
npm run dev

# Access at http://localhost:5173 (default Vite port).

# Build for production (optional):
# npm run build

# Configure Email Service
# Ensure EMAIL_USER and EMAIL_PASSWORD in backend/.env are set correctly.

# Test email sending:
# node -e "require('nodemailer').createTransport({service: 'gmail', auth: {user: process.env.EMAIL_USER, pass: process.env.EMAIL_PASSWORD}}).sendMail({from: process.env.EMAIL_USER, to: 'test@example.com', subject: 'Test', text: 'Test email'}, (err) => console.log(err || 'Email sent'))"

# Alternative SMTP: Update transporter in backend/emailService.js and backend/certificateController.js.

# Configure OpenSSL
# Ensure OpenSSL is installed and accessible in your PATH:
# openssl version

# Start the Application
# Start the backend:
cd ../backend
node index.js
# Confirm: ✅ Server running on port 5000.

# Start the frontend (in another terminal):
cd ../frontend
npm run dev

# Access the application:
# User Dashboard: http://localhost:5173
# Admin Dashboard: http://localhost:5173/admin


# 🛡️ Local Certificate Authority Service

A web-based system that allows users to request, download, and manage digital certificates, while enabling administrators to approve/reject CSRs (Certificate Signing Requests). Powered by PostgreSQL, OpenSSL, Node.js, and React.

---

## 🚀 Demo: How to Use the Service

### 👤 1. Register a User

- Go to: [http://localhost:5173/signup](http://localhost:5173/signup)
- Fill in the form:
  - Username: `user1`
  - Email: `user1@example.com`
  - Password: `user@123`
- Check your email inbox for an OTP.
- Enter OTP → Account verified → Login successful.

---

### 📄 2. Submit a CSR

- Log in as user1 at: [http://localhost:5173](http://localhost:5173)
- Navigate to: "Generate CSR" or "Submit CSR"
- Fill in the certificate form:
  - Domain: `test.example.com`
  - Company: `Test Inc`
  - Division: `IT`
  - City: `Rupnagar`
  - State: `Punjab`
  - Country: `IN`
  - Email: `user1@example.com`
  - Root Length: `2048`
- Submit the form → CSR will appear in the user dashboard.

---

### 🔑 3. Approve or Reject CSR (Admin)

- Login as admin at: [http://localhost:5173/admin](http://localhost:5173/admin)
  - Username: `admin`
  - Password: `admin@123`
- Go to: "Pending CSRs"
- Actions:
  - ✅ Approve → Certificate generated at: backend/certificates/cert_<id>.pem
  - ❌ Reject → Provide reason (e.g., "Invalid domain")
- User (user1@example.com) will receive an email update.

---

### 📥 4. Download Issued Certificate

- Log in as user1
- Go to: "Issued Certificates"
- Download the certificate (e.g., test.example.com_cert.pem)

---

### 📊 5. View Statistics

- User Dashboard:
  - Total CSRs submitted
  - Pending requests
  - Approved and active certificates
- Admin Dashboard:
  - System-wide overview of user activity and certificate stats

---

## 🧯 Troubleshooting

| Issue                  | Fix                                                                 |
|------------------------|----------------------------------------------------------------------|
| Backend errors         | Check logs: `tail -f backend/index.js`                              |
| Database connection    | Run: `psql -U postgres -d ca_db -c "SELECT 1;"`                     |
| Email not sending      | Verify SMTP setup in `.env`; use app-specific Gmail password        |
| CSR generation fails   | Check OpenSSL: `openssl version`<br>Verify permissions on csr_files/ |
| 404 on CSR rejection   | Make sure CSR is still pending:<br>`SELECT id, status FROM csr_requests WHERE id = <id>;`<br>Refresh Admin Portal |

---

## 🤝 Contributing

We welcome all contributions!

1. Fork this repo
2. Create a feature branch:  
   git checkout -b feature/your-feature
3. Make your changes
4. Commit:  
   git commit -m "Add your feature"
5. Push:  
   git push origin feature/your-feature
6. Open a Pull Request 🎉

Please follow our Code of Conduct and include tests where appropriate.

---

## 📄 License

This project is licensed under the MIT License. Feel free to use it for personal or educational projects.

---

## 🙏 Acknowledgments

- Developed under the guidance of:  
  👨‍🏫 Dr. Balwinder Sodhi  
- Inspired by real-world PKI and certificate management systems.

---

## 📬 Contact

For questions, suggestions, or bug reports, feel free to:

- Open a GitHub Issue
- Email us: caservice2025@gmail.com
