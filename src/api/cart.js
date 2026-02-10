import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/cart`,
  withCredentials: true,
});

export const fetchCart = () => API.get("/");

export const addToCartApi = (data) => API.post("/", data); 

export const updateCartApi = (data) => API.put("/", data); 

export const removeCartItemApi = (productId) =>
  API.delete(`/remove/${productId}`);

export const syncCartApi = (cartItems) => API.post("/sync", { cartItems });
