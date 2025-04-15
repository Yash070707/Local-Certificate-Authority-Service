"use client"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { generateCSR, downloadFile } from "../../api/certificateApi"
import "./UserDashboard.css"

// Icons
const ShieldCheck = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="m9 12 2 2 4-4" />
    </svg>
)

const PlusCircle = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="10" />
        <line x1="12" y1="8" x2="12" y2="16" />
        <line x1="8" y1="12" x2="16" y2="12" />
    </svg>
)

const Search = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="11" cy="11" r="8" />
        <line x1="21" y1="21" x2="16.65" y2="16.65" />
    </svg>
)

const RefreshCw = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M21 2v6h-6" />
        <path d="M3 12a9 9 0 0 1 15-6.7L21 8" />
        <path d="M3 22v-6h6" />
        <path d="M21 12a9 9 0 0 1-15 6.7L3 16" />
    </svg>
)

const Shield = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
    </svg>
)

const ShieldAlert = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <path d="M12 8v4" />
        <path d="M12 16h.01" />
    </svg>
)

const ShieldX = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z" />
        <line x1="9" y1="9" x2="15" y2="15" />
        <line x1="15" y1="9" x2="9" y2="15" />
    </svg>
)

const MoreHorizontal = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <circle cx="12" cy="12" r="1" />
        <circle cx="19" cy="12" r="1" />
        <circle cx="5" cy="12" r="1" />
    </svg>
)

const CheckCircle = ({ className }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={className}
    >
        <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
        <polyline points="22 4 12 14.01 9 11.01" />
    </svg>
)

const UserDashboard = () => {
    const { user } = useAuth()
    const [isDialogOpen, setIsDialogOpen] = useState(false)
    const [successMessage, setSuccessMessage] = useState("")
    const [csrFile, setCsrFile] = useState(null)
    const [privateKeyFile, setPrivateKeyFile] = useState(null)
    const [searchTerm, setSearchTerm] = useState("")
    const [countries, setCountries] = useState([])
    const [formData, setFormData] = useState({
        domain: "",
        company: "",
        division: "",
        city: "",
        state: "",
        country: "",
        email: "",
        rootLength: "2048",
        signatureAlgorithm: "SHA-2",
    })

    // Sample certificates data
    const [certificates, setCertificates] = useState([
        {
            id: "cert-1",
            commonName: "example.com",
            organization: "Example Inc",
            issuedDate: "2023-11-15T10:30:00Z",
            expiryDate: "2024-11-15T10:30:00Z",
            status: "Active",
            type: "OV SSL",
        },
        {
            id: "cert-2",
            commonName: "api.example.com",
            organization: "Example Inc",
            issuedDate: "2023-10-05T14:20:00Z",
            expiryDate: "2024-10-05T14:20:00Z",
            status: "Active",
            type: "OV SSL",
        },
        {
            id: "cert-3",
            commonName: "secure.example.com",
            organization: "Example Inc",
            issuedDate: "2023-09-22T09:15:00Z",
            expiryDate: "2024-09-22T09:15:00Z",
            status: "Active",
            type: "EV SSL",
        },
        {
            id: "cert-4",
            commonName: "dev.example.com",
            organization: "Example Inc",
            issuedDate: "2023-08-17T11:45:00Z",
            expiryDate: "2023-12-17T11:45:00Z",
            status: "Expiring Soon",
            type: "DV SSL",
        },
    ])

    useEffect(() => {
        fetch("https://restcountries.com/v3.1/all")
            .then((response) => response.json())
            .then((data) => {
                const countryList = data
                    .map((country) => ({
                        name: country.name.common,
                        code: country.cca2,
                    }))
                    .sort((a, b) => a.name.localeCompare(b.name))
                setCountries(countryList)
            })
            .catch((error) => console.error("Error fetching countries:", error))
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const [formError, setFormError] = useState("")
    const [formSuccess, setFormSuccess] = useState("")

    const handleCSRSubmit = async (e) => {
        e.preventDefault();
        setFormError("");
        setFormSuccess("");

        try {
            const username = user?.username || localStorage.getItem("username");
            const formDataWithUser = { ...formData, username };

            const response = await generateCSR(formDataWithUser);

            if (response.success) {
                console.log("CSR File:", response.csrFile);
                console.log("Private Key File:", response.privateKeyFile);
                setCsrFile(response.csrFile);
                setPrivateKeyFile(response.privateKeyFile);
                setFormSuccess("CSR generated successfully! Download your files below.");
                alert("CSR generated successfully!");

                // Add the new certificate to the list
                const newCertificate = {
                    id: `cert-${certificates.length + 1}`,
                    commonName: formData.domain,
                    organization: formData.company,
                    issuedDate: new Date().toISOString(),
                    expiryDate: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000).toISOString(),
                    status: "Pending",
                    type: "OV SSL",
                };
                setCertificates([newCertificate, ...certificates]);

                // Reset the form fields
                setFormData({
                    domain: "",
                    company: "",
                    division: "",
                    city: "",
                    state: "",
                    country: "",
                    email: "",
                    rootLength: "2048",
                    signatureAlgorithm: "SHA-2",
                });
            } else {
                setFormError("Failed to generate CSR. Please check your inputs and try again.");
            }
        } catch (error) {
            console.error("CSR submission failed:", error);
            setFormError("An error occurred during CSR generation. Please try again.");
        }
    };

    // Add the download buttons in the dialog
    {csrFile && (
            <div className="download-section">
                <h3 className="download-title">
                    <ShieldCheck className="download-icon" />
                    Your CSR has been generated successfully!
                </h3>
                <div className="download-buttons">
                    <button onClick={() => handleDownload(csrFile)} className="download-button">
                        Download CSR
                    </button>
                    <button onClick={() => handleDownload(privateKeyFile)} className="download-button">
                        Download Private Key
                    </button>
                </div>
            </div>
        )
    }

    const handleDownload = (fileName) => {
        downloadFile(fileName);
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setCsrFile(null)
        setPrivateKeyFile(null)
        setFormData({
            domain: "",
            company: "",
            division: "",
            city: "",
            state: "",
            country: "",
            email: "",
            rootLength: "2048",
            signatureAlgorithm: "SHA-2",
        })
    }

    // Calculate certificate statistics
    const totalCertificates = certificates.length
    const activeCertificates = certificates.filter((cert) => cert.status === "Active").length
    const expiringSoon = certificates.filter((cert) => cert.status === "Expiring Soon").length
    const expiredCertificates = certificates.filter((cert) => cert.status === "Expired").length

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString("en-US", {
            year: "numeric",
            month: "short",
            day: "numeric",
        })
    }

    const getStatusBadge = (status) => {
        switch (status.toLowerCase()) {
            case "active":
                return (
                    <span className="status-badge active">
                        <ShieldCheck className="badge-icon" />
                        Active
                    </span>
                )
            case "pending":
                return (
                    <span className="status-badge pending">
                        <Shield className="badge-icon" />
                        Pending
                    </span>
                )
            case "expiring soon":
                return (
                    <span className="status-badge expiring">
                        <ShieldAlert className="badge-icon" />
                        Expiring Soon
                    </span>
                )
            case "expired":
                return (
                    <span className="status-badge expired">
                        <ShieldX className="badge-icon" />
                        Expired
                    </span>
                )
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    const filteredCertificates = certificates.filter(
        (cert) =>
            cert.commonName.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.organization.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.status.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.type.toLowerCase().includes(searchTerm.toLowerCase()),
    )

    return (
        <div className="dashboard-container">
            <header className="dashboard-header">
                <div className="header-content">
                    <div className="logo-container">
                        <ShieldCheck className="logo-icon" />
                        <span className="logo-text">CA Service</span>
                    </div>
                    <div className="user-info">
                        <span>Welcome, {user?.username || "User"}</span>
                    </div>
                </div>
            </header>

            <main className="dashboard-main">
                <div className="dashboard-welcome">
                    <div className="welcome-text">
                        <h1>Certificate Management</h1>
                        <p>Request and manage your SSL/TLS certificates</p>
                        {successMessage && (
                            <div className="success-message">
                                <CheckCircle className="success-icon" />
                                <span>{successMessage}</span>
                            </div>
                        )}
                    </div>
                    <button className="generate-button" onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="button-icon" />
                        Generate New Certificate
                    </button>
                </div>

                <div className="dashboard-stats">
                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Total Certificates</h3>
                            <Shield className="stat-icon" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{totalCertificates}</div>
                            <p className="stat-description">Across all domains</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Active Certificates</h3>
                            <ShieldCheck className="stat-icon active" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{activeCertificates}</div>
                            <p className="stat-description">{Math.round((activeCertificates / totalCertificates) * 100)}% of total</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Expiring Soon</h3>
                            <ShieldAlert className="stat-icon expiring" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{expiringSoon}</div>
                            <p className="stat-description">Expiring in 30 days</p>
                        </div>
                    </div>

                    <div className="stat-card">
                        <div className="stat-header">
                            <h3>Expired</h3>
                            <ShieldX className="stat-icon expired" />
                        </div>
                        <div className="stat-content">
                            <div className="stat-value">{expiredCertificates}</div>
                            <p className="stat-description">Require renewal</p>
                        </div>
                    </div>
                </div>

                <div className="certificate-table-container">
                    <div className="table-header">
                        <h2>Certificate Inventory</h2>
                        <p>View and manage all your SSL/TLS certificates</p>
                        <div className="table-actions">
                            <div className="search-container">
                                <Search className="search-icon" />
                                <input
                                    type="search"
                                    placeholder="Search certificates..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <button className="refresh-button">
                                <RefreshCw className="refresh-icon" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <table className="certificate-table">
                        <thead>
                            <tr>
                                <th>Domain Name</th>
                                <th>Type</th>
                                <th>Issued Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="empty-table">
                                        No certificates found
                                    </td>
                                </tr>
                            ) : (
                                filteredCertificates.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td className="domain-column">
                                            <div>{certificate.commonName}</div>
                                            <div className="organization">{certificate.organization}</div>
                                        </td>
                                        <td>{certificate.type}</td>
                                        <td>{formatDate(certificate.issuedDate)}</td>
                                        <td>{formatDate(certificate.expiryDate)}</td>
                                        <td>{getStatusBadge(certificate.status)}</td>
                                        <td className="actions-column">
                                            <div className="dropdown">
                                                <button className="dropdown-button">
                                                    <MoreHorizontal className="more-icon" />
                                                </button>
                                                <div className="dropdown-content">
                                                    <div className="dropdown-header">Actions</div>
                                                    <div className="dropdown-divider"></div>
                                                    <button className="dropdown-item">View Details</button>
                                                    <button className="dropdown-item">Download Certificate</button>
                                                    <button className="dropdown-item">Renew Certificate</button>
                                                </div>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </main>

            {isDialogOpen && (
                <div className="dialog-overlay">
                    <div className="dialog-container">
                        <div className="dialog-header">
                            <div className="dialog-title">
                                <ShieldCheck className="dialog-icon" />
                                Generate Certificate Signing Request
                            </div>
                            <p className="dialog-description">
                                Fill out the form below to generate a new Certificate Signing Request (CSR).
                            </p>
                        </div>

                        

                        <form onSubmit={handleCSRSubmit} className="csr-form">
                            <div className="form-tabs">
                                <button type="button" className="form-tab active">
                                    Certificate Details
                                </button>
                                <button type="button" className="form-tab">
                                    Advanced Options
                                </button>
                            </div>

                            <div className="form-content">
                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="domain">Domain:</label>
                                        <input
                                            type="text"
                                            id="domain"
                                            name="domain"
                                            placeholder="example.com"
                                            required
                                            value={formData.domain}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="company">Company:</label>
                                        <input
                                            type="text"
                                            id="company"
                                            name="company"
                                            placeholder="Your Company, Inc."
                                            required
                                            value={formData.company}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="division">Division:</label>
                                        <input
                                            type="text"
                                            id="division"
                                            name="division"
                                            placeholder="IT Department"
                                            value={formData.division}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="email">Email:</label>
                                        <input
                                            type="email"
                                            id="email"
                                            name="email"
                                            placeholder="admin@example.com"
                                            required
                                            value={formData.email}
                                            onChange={handleChange}
                                        />
                                    </div>
                                </div>

                                <div className="form-row three-columns">
                                    <div className="form-group">
                                        <label htmlFor="city">City/Locality:</label>
                                        <input
                                            type="text"
                                            id="city"
                                            name="city"
                                            placeholder="San Francisco"
                                            required
                                            value={formData.city}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="state">State/Province:</label>
                                        <input
                                            type="text"
                                            id="state"
                                            name="state"
                                            placeholder="California"
                                            required
                                            value={formData.state}
                                            onChange={handleChange}
                                        />
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="country">Country:</label>
                                        <select id="country" name="country" value={formData.country} onChange={handleChange} required>
                                            <option value="">Select a country</option>
                                            {countries.map((country) => (
                                                <option key={country.code} value={country.code}>
                                                    {country.name}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div className="form-row">
                                    <div className="form-group">
                                        <label htmlFor="rootLength">Root Length:</label>
                                        <select
                                            id="rootLength"
                                            name="rootLength"
                                            value={formData.rootLength}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="2048">2048-bit (Standard)</option>
                                            <option value="4096">4096-bit (High Security)</option>
                                        </select>
                                    </div>

                                    <div className="form-group">
                                        <label htmlFor="signatureAlgorithm">Signature Algorithm:</label>
                                        <select
                                            id="signatureAlgorithm"
                                            name="signatureAlgorithm"
                                            value={formData.signatureAlgorithm}
                                            onChange={handleChange}
                                            required
                                        >
                                            <option value="SHA-2">SHA-2</option>
                                        </select>
                                    </div>
                                    {csrFile && (
                                        <div className="download-section">
                                            <h3 className="download-title">
                                                <ShieldCheck className="download-icon" />
                                                Your CSR has been generated successfully!
                                            </h3>
                                            <div className="download-buttons">
                                                <button onClick={() => handleDownload(csrFile)} className="download-button">
                                                    Download CSR
                                                </button>
                                                <button onClick={() => handleDownload(privateKeyFile)} className="download-button">
                                                    Download Private Key
                                                </button>
                                            </div>
                                        </div>
                                    )}
                                </div>
                            </div>

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={closeDialog}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Generate CSR
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDashboard