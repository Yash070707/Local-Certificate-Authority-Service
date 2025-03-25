import React, { useState, useEffect } from "react";
import forge from "node-forge"; // Import forge for CSR generation
import { generateCSR } from "../../api/certificateApi"; // Corrected API import
import "./GenerateCSR.css";

const GenerateCSR = () => {
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

  const [csr, setCsr] = useState(null);
  const [privateKey, setPrivateKey] = useState(null);
  const [loading, setLoading] = useState(false);

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
    setLoading(true);

    try {
      const response = await generateCSR(formData);

      if (response.success) {
        alert("CSR generated successfully! You can download it now.");
        setCsr(response.csr);
        setPrivateKey(response.privateKey);
      } else {
        alert(`CSR generation failed: ${response.message}`);
      }
    } catch (error) {
      alert("An error occurred while generating CSR.");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const downloadFile = (filename, content) => {
    const blob = new Blob([content], { type: "text/plain" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="container">
      <div className="form-container">
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

          <button type="submit" className="generate-btn" disabled={loading}>
            {loading ? "Generating..." : "Generate CSR"}
          </button>
        </form>

        {csr && (
          <div className="download-buttons">
            <button onClick={() => downloadFile("user-csr.csr", csr)} className="download-btn">
              Download CSR
            </button>
            <button onClick={() => downloadFile("user-private.key", privateKey)} className="download-btn">
              Download Private Key
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default GenerateCSR;
