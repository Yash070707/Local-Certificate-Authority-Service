import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const certificateApi = axios.create({
  baseURL: `${API_BASE_URL}/certificate`, // Ensure consistent API path
  timeout: API_TIMEOUT,
});

// ✅ Corrected function name (submitCSR instead of uploadCSR)
export const submitCSR = async (csrFile) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No authentication token found.");
    }

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
      error.response ? error.response.data : error.message
    );
    return { success: false, message: "CSR upload failed" };
  }
};

// ✅ CSR Generation via Backend
export const generateCSR = async (formData) => {
  try {
    const token = localStorage.getItem("token");
    const username = localStorage.getItem("username");

    if (!token || !username) {
      throw new Error("No token or username found");
    }

    const response = await certificateApi.post(
      "/generate-csr",
      { ...formData, username },
      {
        headers: { Authorization: `Bearer ${token}` },
      }
    );

    return response.data;
  } catch (error) {
    console.error(
      "Error generating CSR:",
      error.response ? error.response.data : error.message
    );
    return { success: false, message: "CSR generation failed" };
  }
};

// ✅ Download CSR or Private Key
export const downloadFile = async (fileName) => {
  try {
    const token = localStorage.getItem("token");

    if (!token) {
      throw new Error("No token found");
    }

    const response = await certificateApi.get(`/download/${fileName}`, {
      responseType: "blob",
      headers: { Authorization: `Bearer ${token}` },
    });

    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", fileName);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  } catch (error) {
    console.error(
      "Error downloading file:",
      error.response ? error.response.data : error.message
    );
  }
};
