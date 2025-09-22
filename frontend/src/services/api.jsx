// src/services/api.jsx
import axios from "axios";
import { devLog } from "../utils/devLog";

const rawBase = import.meta.env.VITE_API_BASE_URL || "http://localhost:8080";
const base = rawBase.replace(/\/+$/, "");
const baseURL = `${base}/api`;

const api = axios.create({
  baseURL,
  withCredentials: true,
});

/* -------------------------
   Request Interceptor
   ------------------------- */
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("jwtToken");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      devLog("API", "Attached JWT token to request");
    }
    return config;
  },
  (err) => Promise.reject(err)
);

/* -------------------------
   Response Interceptor
   ------------------------- */
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      devLog("API", "401 Unauthorized → clearing token & user");

      // Clear auth data
      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");

      // Optional: redirect to login
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }
    return Promise.reject(error);
  }
);

/* -------------------------
   Auth
   ------------------------- */
export const register = (payload) => api.post("/auth/signup", payload);
export const login = (payload) =>
  api.post("/auth/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
export const getCurrentUser = () => api.get("/auth/me");
export const checkUsername = (username) =>
  api.get("/auth/check-username", { params: { username } });
export const checkEmail = (email) =>
  api.get("/auth/check-email", { params: { email } });

/* -------------------------
   Cloudinary Upload
   ------------------------- */
export const uploadImage = async (file) => {
  const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME;
  const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET;

  if (!cloudName || !uploadPreset) {
    throw new Error("Missing Cloudinary env vars. Please set them in .env");
  }

  const url = `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`;

  const data = new FormData();
  data.append("file", file);
  data.append("upload_preset", uploadPreset);

  devLog("API", "Uploading image to Cloudinary…");

  const res = await axios.post(url, data);
  devLog("API", "Image uploaded", res.data.secure_url);

  return res.data.secure_url; // ✅ return hosted image URL
};

/* -------------------------
   Items
   ------------------------- */
export const getItems = () => api.get("/items");
export const getItem = (id) => api.get(`/items/${id}`);
export const createItem = (payload) =>
  api.post("/items", payload, {
    headers: { "Content-Type": "application/json" },
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

/* -------------------------
   Geocoding
   ------------------------- */
export const geocodeAddress = async (address) => {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        address
      )}`
    );
    const data = await res.json();

    if (!data.length) {
      throw new Error("No results found for the given address.");
    }

    return { lat: data[0].lat, lon: data[0].lon };
  } catch (err) {
    throw new Error(err.message || "Failed to geocode address");
  }
};

export default api;
