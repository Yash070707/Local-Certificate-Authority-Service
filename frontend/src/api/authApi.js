import axios from "axios";
import { API_BASE_URL, API_TIMEOUT } from "./apiConfig";

const authApi = axios.create({
  baseURL: `${API_BASE_URL}/auth`,
  timeout: API_TIMEOUT,
  withCredentials: true,
});

export const login = async ({ username, password }) => {
  try {
    const response = await authApi.post("/signin", {
      username: username.trim(),
      password: password.trim(),
    });
    console.log("Login response:", response.data);
    return response.data;
  } catch (error) {
    console.error("Login error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Signin failed");
  }
};

export const register = async ({ username, email, password }) => {
  try {
    const response = await authApi.post("/signup", {
      username,
      email,
      password,
    });
    return response.data;
  } catch (error) {
    console.error("Register error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "Signup failed");
  }
};

export const verifyOtp = async ({ email, otp }) => {
  try {
    const response = await authApi.post("/verify-email", { email, otp });
    return response.data;
  } catch (error) {
    console.error("OTP verification error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(error.response?.data?.message || "OTP verification failed");
  }
};

export const forgotPassword = async ({ email }) => {
  try {
    const response = await authApi.post("/forgot-password", { email });
    return response.data;
  } catch (error) {
    console.error("Forgot password error:", {
      message: error.message,
      response: error.response?.data,
      status: error.response?.status,
    });
    throw new Error(
      error.response?.data?.message || "Forgot password request failed"
    );
  }
};
