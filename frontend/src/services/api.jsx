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
    const user = JSON.parse(localStorage.getItem("user") || "{}");

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      devLog("API", "Attached JWT token to request");
    }

    if (user?.roles?.length) {
      const role = user.roles[0];
      config.headers["X-User-Role"] = role;
      devLog("API", `Attached user role: ${role}`);
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

      localStorage.removeItem("jwtToken");
      localStorage.removeItem("user");

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
const storeAuthData = (res) => {
  if (res.data?.token) {
    localStorage.setItem("jwtToken", res.data.token);
    if (res.data.user) {
      localStorage.setItem("user", JSON.stringify(res.data.user));
    }
    devLog("API", "Stored token & user in localStorage");
  }
  return res;
};

export const register = async (payload) => {
  const res = await api.post("/auth/signup", payload);
  return storeAuthData(res);
};

export const login = async (payload) => {
  const res = await api.post("/auth/login", payload, {
    headers: { "Content-Type": "application/json" },
  });
  return storeAuthData(res);
};

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

  return res.data.secure_url; 
};

/* -------------------------
   Items
   ------------------------- */
export const getItems = () => api.get("/items");
export const getItem = (id) => api.get(`/items/${id}`);
export const updateItem = (id, payload) =>
  api.put(`/items/${id}`, payload, {
    headers: { "Content-Type": "application/json" },
  });
export const createItem = (payload) =>
  api.post("/items", payload, {
    headers: { "Content-Type": "application/json" },
  });

/* -------------------------
   Borrow/Requests
   ------------------------- */
export const createRequest = (itemId, payload) =>
  api.post(`/items/${itemId}/request`, payload);

export const getMyRequests = async () => {
  console.log("[DEBUG][API] → GET /requests/received");
  const res = await api.get("/requests/received");
  console.log("[DEBUG][API] Response from backend:", res);
  return res.data;
};

export const cancelRequest = (requestId) =>
  api.post(`/requests/${requestId}/cancel`);

/* ---- NEWLY ADDED ---- */
export const getReceivedRequests = () => api.get("/requests/received");

export const acceptRequest = (id) =>
  api.post(`/requests/${id}/accept`);

export const rejectRequest = (id) =>
  api.post(`/requests/${id}/reject`);

/* -------------------------
   Map & Trust
   ------------------------- */
export const getMapItems = () => api.get("/map-items");
export const getTrustScore = (userId) => api.get(`/trust-score/${userId}`);

/* -------------------------
   Geocoding (pincode + state + country)
   ------------------------- */
export const geocodeAddress = async (pincode, state, country) => {
  try {
    const query = `${pincode}, ${state}, ${country}`;
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(
        query
      )}`
    );
    const data = await res.json();

    if (!data.length) {
      throw new Error("No results found for the given location.");
    }

    return { lat: parseFloat(data[0].lat), lon: parseFloat(data[0].lon) };
  } catch (err) {
    throw new Error(err.message || "Failed to geocode address");
  }
};

export default api;
