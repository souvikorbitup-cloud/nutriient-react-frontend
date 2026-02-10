import axios from "axios";
import { BASE_URL } from "../variables.js";

const API = axios.create({
  baseURL: `${BASE_URL}/order`,
  withCredentials: true,
});

/* ======================
   USER
====================== */

export const createOrderApi = (data) => API.post("/", data);

export const fetchMyOrdersApi = () => API.get("/my-orders");

export const fetchOrderByIdApi = (orderId) => API.get(`/${orderId}`);

/* ======================
   ADMIN
====================== */

export const fetchAllOrdersApi = () => API.get("/");

export const updateDeliveryStateApi = (orderId, deliveryState) =>
  API.put(`/${orderId}/delivery-state`, { deliveryState });
