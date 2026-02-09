import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/category`,
  withCredentials: true,
});

/* ===================== PUBLIC ===================== */

// Get all categories
export const getAllCategories = () => API.get("/");

// Get categories by type
// example: ?type=fitness
export const getCategoriesByType = () => API.get(`/type`);

/* ================= ADMIN / MANAGER ================= */

// Create category
export const createCategory = (data) => API.post("/", data);

// Update category
export const updateCategory = (categoryId, data) =>
  API.put(`/${categoryId}`, data);

// Delete category
export const deleteCategory = (categoryId) => API.delete(`/${categoryId}`);
