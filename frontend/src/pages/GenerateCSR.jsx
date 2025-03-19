import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './GenerateCSR.css';

const GenerateCSR = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name)); // Sort alphabetically
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleSubmit = (event) => {
    event.preventDefault();
    alert('CSR generated successfully!');
    navigate('/download-csr');
  };

  return (
    <div className="container">
      <nav className="navbar">
        <div className="nav-item active">Generate CSR</div>
        <div className="nav-item">User Dashboard</div>
        <div className="nav-item">Analytics</div>
        <div className="nav-profile"></div>
      </nav>

      <div className="form-container">
        <h1>Generate CSR</h1>
        <form id="csrForm" onSubmit={handleSubmit}>
          <div className="form-group">
            <label htmlFor="domain">* Domain:</label>
            <input type="text" id="domain" name="domain" required />
            <small>CN - Common Name</small>
          </div>
          
          <div className="form-group">
            <label htmlFor="company">* Company:</label>
            <input type="text" id="company" name="company" required />
            <small>O - Organization Name</small>
          </div>

          <div className="form-group">
            <label htmlFor="division">* Division:</label>
            <input type="text" id="division" name="division" required />
            <small>OU - Organization Unit</small>
          </div>

          <div className="form-group">
            <label htmlFor="city">* City:</label>
            <input type="text" id="city" name="city" required />
            <small>L - Locality</small>
          </div>

          <div className="form-group">
            <label htmlFor="state">* State:</label>
            <input type="text" id="state" name="state" required />
            <small>ST - State or Province</small>
          </div>

          <div className="form-group">
            <label>Country:</label>
            <select>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="email">* E-mail:</label>
            <input type="email" id="email" name="email" required />
          </div>

          <div className="form-group">
            <label htmlFor="rootLength">* Root Length:</label>
            <select id="rootLength" name="rootLength" required>
              <option value="2048">2048-bit</option>
              <option value="4096">4096-bit</option>
            </select>
            <small>Only choose 4096-bit if necessary</small>
          </div>

          <div className="form-group">
            <label htmlFor="signatureAlgorithm">* Signature Algorithm:</label>
            <select id="signatureAlgorithm" name="signatureAlgorithm" required>
              <option value="SHA-2">SHA-2</option>
            </select>
            <small>SHA-2 is the strongest algorithm</small>
          </div>

          <button type="submit" className="generate-btn">Generate CSR</button>
        </form>
      </div>
    </div>
  );
};

export default GenerateCSR;