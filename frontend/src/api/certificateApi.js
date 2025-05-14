import axios from "axios";
import { jwtDecode } from "jwt-decode"; // Fixed import: use named export
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const certificateApi = axios.create({
  baseURL: `${API_BASE_URL}/certificate`,
  timeout: API_TIMEOUT,
});

// CSR Operations
export const submitCSR = async (csrData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const response = await certificateApi.post("/submit", csrData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error submitting CSR:",
      error.response?.data || error.message
    );
    return { success: false, message: "CSR submission failed" };
  }
};

export const generateCSR = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found");

    // Decode JWT token to get username
    let username;
    try {
      const decoded = jwtDecode(token);
      username = decoded.username || decoded.sub || decoded.name; // Adjust based on token structure
      if (!username) throw new Error("Username not found in token");
    } catch (err) {
      throw new Error("Invalid token or username not found");
    }

    const response = await certificateApi.post(
      "/generate-csr",
      { ...formData, username },
      { headers: { Authorization: `Bearer ${token}` } }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating CSR:",
      error.response?.data || error.message
    );
    return { success: false, message: "CSR generation failed" };
  }
};

// Fetch user-specific CSRs
export const getUserCSRs = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await certificateApi.get("/csrs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      return response.data;
    } else {
      console.error("Error fetching user CSRs:", response.data.message);
      return { success: false, data: [] };
    }
  } catch (error) {
    console.error("Error fetching user CSRs:", error);
    return { success: false, data: [] };
  }
};

// Fetch issued certificates
export const getIssuedCertificates = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await certificateApi.get("/issued", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      return response.data;
    } else {
      console.error(
        "Error fetching issued certificates:",
        response.data.message
      );
      return { success: false, data: [] };
    }
  } catch (error) {
    console.error("Error fetching issued certificates:", error);
    return { success: false, data: [] };
  }
};

// Download CSR file
export const downloadCSR = async (filename) => {
  try {
    if (!filename) throw new Error("Filename is undefined");

    const response = await axios.get(
      `${API_BASE_URL}/certificate/download/${filename}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const fileBlob = response.data;
    const fileURL = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = filename;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    }, 1000);
  } catch (error) {
    console.error("Error downloading CSR:", error);
    throw error;
  }
};

// Download certificate by ID
export const downloadCertificate = async (certId, domain) => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/certificate/download-cert/${certId}`,
      {
        responseType: "blob",
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      }
    );

    const fileBlob = response.data;
    const fileURL = URL.createObjectURL(fileBlob);
    const link = document.createElement("a");
    link.href = fileURL;
    link.download = `${domain}_cert.pem`;
    document.body.appendChild(link);
    link.click();

    setTimeout(() => {
      document.body.removeChild(link);
      URL.revokeObjectURL(fileURL);
    }, 1000);
  } catch (error) {
    console.error("Error downloading certificate:", error);
    throw error;
  }
};
