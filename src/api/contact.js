import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/contact`,
  withCredentials: true,
});

// Public
export const createContact = (data) => API.post("/", data);

// Admin / Manager
export const getAllContacts = () => API.get("/");
export const getContactById = (contactId) => API.get(`/${contactId}`);
export const deleteContact = (contactId) => API.delete(`/${contactId}`);
