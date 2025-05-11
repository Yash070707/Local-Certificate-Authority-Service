import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const certificateApi = axios.create({
  baseURL: `${API_BASE_URL}/certificate`,
  timeout: API_TIMEOUT,
});

// CSR Operations
export const submitCSR = async (csrFile) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No authentication token found.");

    const formData = new FormData();
    formData.append("csr", csrFile);

    const response = await certificateApi.post("/upload-csr", formData, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "multipart/form-data",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error uploading CSR:",
      error.response?.data || error.message
    );
    return { success: false, message: "CSR upload failed" };
  }
};

export const generateCSR = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) throw new Error("No token or username found");

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
      return response.data.data;
    } else {
      console.error("Error fetching user CSRs:", response.data.message);
      return [];
    }
  } catch (error) {
    console.error("Error fetching user CSRs:", error);
    return [];
  }
};

// File Download Operations
export const downloadFile = async (filename, type = "csr") => {
  try {
    if (!filename) throw new Error("Filename is undefined");

    const endpoint =
      type === "certificate"
        ? `${API_BASE_URL}/certificate/download/cert/${filename}`
        : `${API_BASE_URL}/certificate/download/csr/${filename}`;

    const response = await axios.get(endpoint, {
      responseType: "blob",
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    });

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
    console.error("Error downloading file:", error);
    throw error;
  }
};

// Certificate Operations
export const getIssuedCertificates = async () => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("No token found");
    const response = await certificateApi.get("/issued", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      return response.data.data;
    } else {
      console.error(
        "Error fetching issued certificates:",
        response.data.message
      );
      return [];
    }
  } catch (error) {
    console.error("Error fetching issued certificates:", error);
    return [];
  }
};

export const getCertificateStatus = async (certificateId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await certificateApi.get(`/status/${certificateId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking certificate status:", error);
    return { success: false, message: "Failed to check status" };
  }
};

export const renewCertificate = async (certificateId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await certificateApi.post(
      "/renew",
      { certificate_id: certificateId },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error renewing certificate:", error);
    return { success: false, message: "Failed to renew certificate" };
  }
};

// CSR Status Operations
export const getCSRStatus = async (csrId) => {
  try {
    const token = localStorage.getItem("token");
    const response = await certificateApi.get(`/csr/status/${csrId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error checking CSR status:", error);
    return { success: false, message: "Failed to check CSR status" };
  }
};

// Utility functions
export const getCertificateDownloadLink = (filename) => {
  return `${API_BASE_URL}/certificate/download/cert/${filename}?token=${localStorage.getItem(
    "token"
  )}`;
};

export const getCSRDownloadLink = (filename) => {
  return `${API_BASE_URL}/certificate/download/csr/${filename}?token=${localStorage.getItem(
    "token"
  )}`;
};
