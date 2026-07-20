import axios from "axios";

const API = axios.create({ baseURL: "http://localhost:5000/api/auth" });



export const login = (data) => API.post("auth/login", data);
export const register = (data) => API.post("auth/register", data);
export const logout = () => API.post("auth/logout");

export const sendResetOTP = (data) => API.post("/forgot-password", data);
export const verifyOTP = (data) => API.post("/verify-otp", data);
export const resetPassword = (data) => API.post("/reset-password", data);