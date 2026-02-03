import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/contact`,
  withCredentials: true,
});

export const createContact = (data) => API.post("/", data);
