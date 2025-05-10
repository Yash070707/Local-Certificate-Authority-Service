import axios from "axios";
import { API_BASE_URL, CERTIFICATE_STATUS } from "./apiConfig";

const adminApi = axios.create({
  baseURL: `${API_BASE_URL}/certificate`,
  timeout: 30000,
});

// Admin CSR Operations
export const getPendingCSRs = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.get("/pending-csrs", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching pending CSRs:", error);
    return { success: false, message: "Failed to fetch pending CSRs" };
  }
};

export const approveCSR = async (csrId, validityDays = 365) => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.post(
      "/approve-csr",
      { csr_id: csrId, validity_days: validityDays },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error approving CSR:", error);
    return { success: false, message: "Failed to approve CSR" };
  }
};

export const rejectCSR = async (csrId, reason = "No reason provided") => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.post(
      "/reject-csr",
      { csr_id: csrId, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error rejecting CSR:", error);
    return { success: false, message: "Failed to reject CSR" };
  }
};

// Admin Certificate Operations
export const getAllCertificates = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.get("/issued", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching certificates:", error);
    return { success: false, message: "Failed to fetch certificates" };
  }
};

export const revokeCertificate = async (certificateId, reason = "") => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.post(
      "/revoke",
      { certificate_id: certificateId, reason },
      { headers: { Authorization: `Bearer ${token}` } }
    );
    return response.data;
  } catch (error) {
    console.error("Error revoking certificate:", error);
    return { success: false, message: "Failed to revoke certificate" };
  }
};

export const getRevokedCertificates = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.get("/revoked", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching revoked certificates:", error);
    return { success: false, message: "Failed to fetch revoked certificates" };
  }
};

// Admin Statistics
export const getCertificateStats = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await adminApi.get("/stats/certificates", {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching certificate stats:", error);
    return { success: false, message: "Failed to fetch stats" };
  }
};
