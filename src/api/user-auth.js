import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/users`,
  withCredentials: true,
});

export const userSignUp = (data) => API.post("/register", data);

export const userSignIn = (data) => API.post("/login", data);

export const currentUser = () => API.get("/current-user");

export const updateUser = (data) => API.put("/update-account", data);

export const logoutUser = () => API.post("/logout");
