import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/chart`,
  withCredentials: true,
});

// Admin / Manager
export const addChart = (data) => API.post("/", data);

export const getAllCharts = ({ page, limit }) =>
  API.get(`?page=${page}&limit=${limit}`);

export const updateSelectedChart = (chartId, data) =>
  API.patch(`/${chartId}`, data);

export const deleteChart = (chartId) => API.delete(`/${chartId}`);
