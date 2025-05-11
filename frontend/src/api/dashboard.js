import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const dashboardApi = axios.create({
  baseURL: `${API_BASE_URL}/dashboard`,
  timeout: API_TIMEOUT,
});

export const fetchUserDashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await dashboardApi.get("/user", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      console.log("User Dashboard Data:", response.data.data);
      return response.data.data;
    } else {
      console.error("Error fetching user dashboard:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("User Dashboard API Error:", error);
    return null;
  }
};

export const fetchAdminDashboard = async () => {
  try {
    const token = localStorage.getItem("token");
    const response = await dashboardApi.get("/admin", {
      headers: { Authorization: `Bearer ${token}` },
    });
    if (response.data.success) {
      console.log("Admin Dashboard Data:", response.data.data);
      return response.data.data;
    } else {
      console.error("Error fetching admin dashboard:", response.data.message);
      return null;
    }
  } catch (error) {
    console.error("Admin Dashboard API Error:", error);
    return null;
  }
};