import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/admin`,
  withCredentials: true,
});

export const createManager = (data) => API.post("/register", data);

export const adminLogin = (data) => API.post("/login", data);

export const updateAdmin = (data) => API.put("/update-account", data);

export const updatePassword = (data) => API.put("/update-password", data);

export const allmanagers = () => API.get("/all-managars");

export const deleteManager = (managerId) =>
  API.delete(`/delete-account/${managerId}`);

export const adminLogout = () => API.post(`/logout`);

export const getAllUsers = () => API.get(`/users`);

export const getStats = () => API.get(`/stats`);
