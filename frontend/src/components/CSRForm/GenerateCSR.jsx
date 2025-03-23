import React, { useState, useEffect } from "react";
//import { useNavigate } from "react-router-dom";
import { generateCSR, downloadFile } from "../../api/certificateApi"; // Correct import path
import "./GenerateCSR.css";

const GenerateCSR = () => {
//  //const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
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
  });
  const [csrFile, setCsrFile] = useState(null);
  const [privateKeyFile, setPrivateKeyFile] = useState(null);

  useEffect(() => {
    fetch("https://restcountries.com/v3.1/all")
      .then((response) => response.json())
      .then((data) => {
        const countryList = data
          .map((country) => ({
            name: country.name.common,
            code: country.cca2,
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(countryList);
      })
      .catch((error) => console.error("Error fetching countries:", error));
  }, []);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    // Get the logged-in username from localStorage
    const username = localStorage.getItem('username');

    // Append username to form data
    const formDataWithUser = { ...formData, username };

    const response = await generateCSR(formDataWithUser);
    if (response.success) {
      alert("CSR generated successfully!");
      
      // Set the CSR and Private Key file names for download
      setCsrFile(response.csrFile);
      setPrivateKeyFile(response.privateKeyFile);
    } else {
      alert("Failed to generate CSR. Please try again.");
    }
  };

  const handleDownload = (fileName) => {
    downloadFile(fileName);
  };

  return (
    <div className="container">
      <div className="form-container">
        {csrFile && (
          <div className="download-buttons">
            <button onClick={() => handleDownload(csrFile)} className="download-btn">Download CSR</button>
            <button onClick={() => handleDownload(privateKeyFile)} className="download-btn">Download Private Key</button>
          </div>
        )}
        <h1>Generate CSR</h1>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Domain:</label>
            <input type="text" name="domain" value={formData.domain} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Company:</label>
            <input type="text" name="company" value={formData.company} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Division:</label>
            <input type="text" name="division" value={formData.division} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>City:</label>
            <input type="text" name="city" value={formData.city} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>State:</label>
            <input type="text" name="state" value={formData.state} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Country:</label>
            <select name="country" value={formData.country} onChange={handleChange} required>
              <option value="">Select a country</option>
              {countries.map((country) => (
                <option key={country.code} value={country.code}>
                  {country.name}
                </option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label>Email:</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} required />
          </div>

          <div className="form-group">
            <label>Root Length:</label>
            <select name="rootLength" value={formData.rootLength} onChange={handleChange} required>
              <option value="2048">2048-bit</option>
              <option value="4096">4096-bit</option>
            </select>
          </div>

          <div className="form-group">
            <label>Signature Algorithm:</label>
            <select name="signatureAlgorithm" value={formData.signatureAlgorithm} onChange={handleChange} required>
              <option value="SHA-2">SHA-2</option>
            </select>
          </div>

          <button type="submit" className="generate-btn">Generate CSR</button>
        </form>
      </div>
    </div>
  );
};

export default GenerateCSR;