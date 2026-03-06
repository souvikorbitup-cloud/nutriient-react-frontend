import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/pricing-plans`,
  withCredentials: true,
});

/* ================= PUBLIC ================= */

// Get active pricing plans (for website pricing section)
export const getActivePricingPlans = () => API.get("/active");

/* =============== ADMIN / MANAGER =============== */

// Get all pricing plans (admin panel)
export const getAllPricingPlans = (page = 1, limit = 10) =>
  API.get(`/?page=${page}&limit=${limit}`);

// Get single pricing plan
export const getPricingPlanById = (planId) => API.get(`/${planId}`);

// Create pricing plan
export const createPricingPlan = (data) => API.post("/", data);

// Update pricing plan
export const updatePricingPlan = (planId, data) => API.put(`/${planId}`, data);

// Delete pricing plan (soft delete)
export const deletePricingPlan = (planId) => API.delete(`/${planId}`);
