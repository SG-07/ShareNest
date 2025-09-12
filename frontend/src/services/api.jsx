// src/services/api.js
import axios from "axios";

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const base = rawBase.replace(/\/+$/, "");
const baseURL = `${base}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
  },
  (err) => Promise.reject(err)
);

/* -------------------------
   Auth
   ------------------------- */
export const register = (payload) => api.post("/auth/register", payload);
export const login = (payload) => api.post("/auth/login", payload);
export const logout = () => api.post("/auth/logout");
export const getCurrentUser = () => api.get("/auth/me");
export const checkUsername = (username) =>
  api.get("/auth/check-username", { params: { username } });

/* -------------------------
   Items
   ------------------------- */
export const getItems = () => api.get("/items");
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (formData) =>
  api.post("/items", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });

/* -------------------------
   Borrow/Requests
   ------------------------- */
export const createRequest = (itemId, payload) =>
  api.post(`/items/${itemId}/request`, payload);
export const getMyRequests = () => api.get("/requests/my");
export const cancelRequest = (requestId) =>
  api.post(`/requests/${requestId}/cancel`);

/* -------------------------
   Map & Trust
   ------------------------- */
export const getMapItems = () => api.get("/map-items");
export const getTrustScore = (userId) => api.get(`/trust-score/${userId}`);

export default api;
