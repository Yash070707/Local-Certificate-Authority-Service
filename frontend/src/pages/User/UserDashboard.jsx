"use client"

import React, { useEffect, useState } from "react"
import { useAuth } from "../../contexts/AuthContext"
import { generateCSR, submitCSR, getUserCSRs, getIssuedCertificates, downloadCSR, downloadCertificate } from "../../api/certificateApi"
import { fetchUserDashboard } from '../../api/dashboard'
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
    const [formError, setFormError] = useState("")
    const [csrFile, setCsrFile] = useState(null)
    const [csrId, setCsrId] = useState(null) // Added to store CSR ID
    const [searchTerm, setSearchTerm] = useState("")
    const [countries, setCountries] = useState([])
    const [csrs, setCsrs] = useState([])
    const [issuedCertificates, setIssuedCertificates] = useState([])
    const [notifications, setNotifications] = useState([])
    const [loading, setLoading] = useState(true)
    const [dashboardStats, setDashboardStats] = useState(null)
    const [error, setError] = useState('')
    const [formData, setFormData] = useState({
        domain: "",
        company: "",
        division: "",
        city: "",
        state: "",
        country: "",
        email: "",
        rootLength: "2048",
    })

    useEffect(() => {
        // Fetch countries
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

        // Initial data fetch
        const loadData = async () => {
            try {
                setLoading(true)
                const [csrData, certData, statsData] = await Promise.all([
                    getUserCSRs(),
                    getIssuedCertificates(),
                    fetchUserDashboard(),
                ])

                setCsrs(csrData.success ? csrData.data : [])
                setIssuedCertificates(certData.success ? certData.data : [])
                setDashboardStats(statsData || {
                    total_csrs: 0,
                    pending_csrs: 0,
                    approved_csrs: 0,
                    active_certs: 0
                })
                setError('')

                // Generate notifications for non-pending CSRs
                const newNotifications = (csrData.success ? csrData.data : [])
                    .filter(csr => csr.status !== 'pending')
                    .map(csr => ({
                        id: csr.id,
                        message: `CSR for ${csr.domain} has been ${csr.status}.`,
                        type: csr.status,
                        date: csr.updated_at || csr.created_at,
                    }))
                setNotifications(newNotifications)
            } catch (error) {
                console.error("Error loading user dashboard:", error)
                setError("Error loading dashboard data")
            } finally {
                setLoading(false)
            }
        }

        loadData()

        // Polling for updates
        const pollInterval = setInterval(loadData, 300000) // Poll every 5 minutes
        return () => clearInterval(pollInterval)
    }, [])

    const handleChange = (e) => {
        const { name, value } = e.target
        setFormData({ ...formData, [name]: value })
    }

    const handleCSRSubmit = async (e) => {
        e.preventDefault()
        setFormError("")
        setSuccessMessage("")
        setCsrFile(null)
        setCsrId(null)

        try {
            const username = user?.username
            if (!username) {
                throw new Error("User not authenticated")
            }

            // Validate required fields
            const requiredFields = ['domain', 'company', 'division', 'city', 'state', 'country', 'email', 'rootLength']
            for (const field of requiredFields) {
                if (!formData[field]) {
                    throw new Error(`Missing required field: ${field}`)
                }
            }

            const formDataWithUser = { ...formData, username }
            const result = await generateCSR(formDataWithUser)

            if (result.success) {
                const { csr, privateKey, csrFile, data } = result
                setCsrFile(csrFile) // e.g., csr_24.pem
                setCsrId(data.id) // e.g., 24
                setSuccessMessage("CSR generated and submitted successfully!")

                // Submit CSR to backend
                await submitCSR({
                    ...formData,
                    csr,
                    root_length: formData.rootLength,
                })

                // Download CSR
                const csrBlob = new Blob([csr], { type: "text/plain" })
                const csrURL = URL.createObjectURL(csrBlob)
                const csrLink = document.createElement("a")
                csrLink.href = csrURL
                csrLink.download = `csr_${formData.domain}.pem`
                document.body.appendChild(csrLink)
                csrLink.click()
                document.body.removeChild(csrLink)
                URL.revokeObjectURL(csrURL)

                // Download Private Key
                const keyBlob = new Blob([privateKey], { type: "text/plain" })
                const keyURL = URL.createObjectURL(keyBlob)
                const keyLink = document.createElement("a")
                keyLink.href = keyURL
                keyLink.download = `${formData.domain}_key.pem`
                document.body.appendChild(keyLink)
                keyLink.click()
                document.body.removeChild(keyLink)
                URL.revokeObjectURL(keyURL)

                // Refresh CSRs
                const csrResponse = await getUserCSRs()
                if (csrResponse.success) {
                    setCsrs(csrResponse.data)
                }
            } else {
                setFormError(result.message || "Failed to generate CSR. Please check your inputs and try again.")
            }
        } catch (err) {
            console.error("Error generating CSR:", err)
            setFormError(err.message || "Something went wrong while generating the CSR.")
        }
    }

    const handleDownload = async (id, domain, type = "csr") => {
        try {
            if (type === "csr") {
                // Use the provided id directly as the filename for CSRs
                await downloadCSR(`csr_${id}.pem`)
            } else if (type === "certificate") {
                await downloadCertificate(id, domain)
            }
        } catch (error) {
            console.error(`Error downloading ${type}:`, error)
            setFormError(`Failed to download ${type} file.`)
        }
    }

    const closeDialog = () => {
        setIsDialogOpen(false)
        setCsrFile(null)
        setCsrId(null)
        setFormError("")
        setSuccessMessage("")
        setFormData({
            domain: "",
            company: "",
            division: "",
            city: "",
            state: "",
            country: "",
            email: "",
            rootLength: "2048",
        })
    }

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
            case "approved":
                return (
                    <span className="status-badge approved">
                        <ShieldCheck className="badge-icon" />
                        Approved
                    </span>
                )
            case "rejected":
                return (
                    <span className="status-badge rejected">
                        <ShieldX className="badge-icon" />
                        Rejected
                    </span>
                )
            case "revoked":
                return (
                    <span className="status-badge expired">
                        <ShieldX className="badge-icon" />
                        Revoked
                    </span>
                )
            default:
                return <span className="status-badge">{status}</span>
        }
    }

    const filteredCertificates = issuedCertificates.filter(
        (cert) =>
            cert.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            cert.status.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const filteredCSRs = csrs.filter(
        (csr) =>
            csr.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
            csr.company.toLowerCase().includes(searchTerm.toLowerCase()) ||
            csr.status.toLowerCase().includes(searchTerm.toLowerCase())
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
                        {error && <div className="error-message">{error}</div>}
                        {formError && <div className="error-message">{formError}</div>}
                    </div>
                    <button className="generate-button" onClick={() => setIsDialogOpen(true)}>
                        <PlusCircle className="button-icon" />
                        Generate New CSR
                    </button>
                </div>

                {dashboardStats ? (
                    <div className="dashboard-stats">
                        <h2>Dashboard Statistics</h2>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Total CSRs</h3>
                                <Shield className="stat-icon" />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{dashboardStats.total_csrs}</div>
                                <p className="stat-description">All CSR requests</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Pending CSRs</h3>
                                <Shield className="stat-icon" />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{dashboardStats.pending_csrs}</div>
                                <p className="stat-description">Awaiting approval</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Approved CSRs</h3>
                                <ShieldCheck className="stat-icon active" />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{dashboardStats.approved_csrs}</div>
                                <p className="stat-description">Certificates issued</p>
                            </div>
                        </div>
                        <div className="stat-card">
                            <div className="stat-header">
                                <h3>Active Certificates</h3>
                                <ShieldCheck className="stat-icon active" />
                            </div>
                            <div className="stat-content">
                                <div className="stat-value">{dashboardStats.active_certs}</div>
                                <p className="stat-description">Valid certificates</p>
                            </div>
                        </div>
                    </div>
                ) : (
                    <p>Loading dashboard stats...</p>
                )}

                <div className="notifications-section">
                    <h2>Notifications</h2>
                    {notifications.length === 0 ? (
                        <p className="empty-table">No new notifications</p>
                    ) : (
                        <div className="notification-list">
                            {notifications.map((notification) => (
                                <div
                                    key={notification.id}
                                    className={`notification-item ${notification.type}`}
                                >
                                    <CheckCircle className="notification-icon" />
                                    <span className="notification-message">{notification.message}</span>
                                    <span className="notification-date">{formatDate(notification.date)}</span>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <div className="certificate-table-container">
                    <div className="table-header">
                        <h2>CSR Requests</h2>
                        <p>View and manage your certificate signing requests</p>
                        <div className="table-actions">
                            <div className="search-container">
                                <Search className="search-icon" />
                                <input
                                    type="search"
                                    placeholder="Search CSRs..."
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="search-input"
                                />
                            </div>
                            <button className="refresh-button" onClick={() => {
                                setLoading(true)
                                getUserCSRs().then(res => {
                                    if (res.success) setCsrs(res.data)
                                    setLoading(false)
                                })
                            }}>
                                <RefreshCw className="refresh-icon" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <table className="certificate-table">
                        <thead>
                            <tr>
                                <th>Domain Name</th>
                                <th>Organization</th>
                                <th>Submitted</th>
                                <th>Status</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="empty-table">Loading...</td>
                                </tr>
                            ) : filteredCSRs.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-table">No CSRs found</td>
                                </tr>
                            ) : (
                                filteredCSRs.map((csr) => (
                                    <tr key={csr.id}>
                                        <td className="domain-column">{csr.domain}</td>
                                        <td>{csr.company}</td>
                                        <td>{formatDate(csr.created_at)}</td>
                                        <td>{getStatusBadge(csr.status)}</td>
                                        <td className="actions-column">
                                            {csr.status === "pending" && (
                                                <button
                                                    className="download-button"
                                                    onClick={() => handleDownload(csr.id, csr.domain, "csr")}
                                                >
                                                    Download CSR
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                <div className="certificate-table-container">
                    <div className="table-header">
                        <h2>Issued Certificates</h2>
                        <p>View and manage your issued certificates</p>
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
                            <button className="refresh-button" onClick={() => {
                                setLoading(true)
                                getIssuedCertificates().then(res => {
                                    if (res.success) setIssuedCertificates(res.data)
                                    setLoading(false)
                                })
                            }}>
                                <RefreshCw className="refresh-icon" />
                                Refresh
                            </button>
                        </div>
                    </div>

                    <table className="certificate-table">
                        <thead>
                            <tr>
                                <th>Domain Name</th>
                                <th>Issued Date</th>
                                <th>Expiry Date</th>
                                <th>Status</th>
                                <th className="actions-column">Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={5} className="empty-table">Loading...</td>
                                </tr>
                            ) : filteredCertificates.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="empty-table">No certificates found</td>
                                </tr>
                            ) : (
                                filteredCertificates.map((certificate) => (
                                    <tr key={certificate.id}>
                                        <td className="domain-column">{certificate.domain}</td>
                                        <td>{formatDate(certificate.issued_at)}</td>
                                        <td>{formatDate(certificate.valid_till)}</td>
                                        <td>{getStatusBadge(certificate.status)}</td>
                                        <td className="actions-column">
                                            {certificate.status === "active" && (
                                                <button
                                                    className="download-button"
                                                    onClick={() => handleDownload(certificate.id, certificate.domain, "certificate")}
                                                >
                                                    Download Certificate
                                                </button>
                                            )}
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
                                            required
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
                                </div>
                            </div>

                            {formError && <div className="form-error">{formError}</div>}

                            <div className="form-actions">
                                <button type="button" className="cancel-button" onClick={closeDialog}>
                                    Cancel
                                </button>
                                <button type="submit" className="submit-button">
                                    Generate CSR
                                </button>
                            </div>
                        </form>

                        {csrFile && (
                            <div className="download-section">
                                <h3 className="download-title">
                                    <ShieldCheck className="download-icon" />
                                    Your CSR has been generated successfully!
                                </h3>
                                <p>CSR File: {csrFile}</p>
                                <div className="download-buttons">
                                    <button
                                        type="button"
                                        onClick={() => handleDownload(csrId, formData.domain, "csr")}
                                        className="download-button"
                                    >
                                        Download CSR
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    )
}

export default UserDashboard