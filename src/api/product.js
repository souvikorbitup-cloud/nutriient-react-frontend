import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/product`,
  withCredentials: true, // required for JWT cookie auth
});

/* ===================== PUBLIC ===================== */

// Get all products
export const getAllProducts = (params = {}) => API.get("/", { params });
export const getAllProductsName = (recommended = false) =>
  API.get("/all", {
    params: { recommended },
  });

// Get product by ID
export const getProductById = (productId) => API.get(`/${productId}`);

// Get products by category name
export const getProductsByCategoryName = (categoryName) =>
  API.get(`/category/${categoryName}`);

// Get recommended products by goal
export const getProductsByGoal = (goal) =>
  API.get(`/recommendation/${encodeURIComponent(goal)}`);

/* ================= ADMIN / MANAGER ================= */

// Create product (multipart/form-data)
export const createProduct = (data) =>
  API.post("/", data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Update product (multipart/form-data)
export const updateProduct = (productId, data) =>
  API.put(`/${productId}`, data, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

// Delete product
export const deleteProduct = (productId) => API.delete(`/${productId}`);

// Get products grouped by goals
export const getProductsGroupedByGoal = () => API.get("/goals/recommendations");

// Add or remove product from goal
export const updateProductGoal = (productId, data) =>
  API.patch(`/${productId}/goal`, data);
