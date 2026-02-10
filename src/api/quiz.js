import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/quiz`,
  withCredentials: true,
});

export const getSession = (id) => API.get(`/session/${id}`);

export const getQuestions = (section, goal = "NONE") =>
  API.get(`/questions?section=${section}&goal=${goal}`);

export const syncSession = (payload) => API.post("/sync", payload);

export const getUserSession = () => API.get("/user/session");

export const deleteSession = (id) => API.delete(`/session/${id}`);

export const getReport = (id) => API.get(`/report/${id}`);
