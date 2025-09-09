// src/services/api.js
import axios from 'axios';

/**
 * Build a baseURL that ensures "/api" is appended once.
 * Read from REACT_APP_API_BASE_URL in .env (you included this file).
 */
const rawBase = process.env.REACT_APP_API_BASE_URL || 'http://localhost:8080';
const base = rawBase.replace(/\/+$/, ''); // strip trailing slashes
const baseURL = `${base}/api`; // safe: ensures we call backend at /api/*

const api = axios.create({
  baseURL,
  withCredentials: true, // keep withCookies if using cookies
});

// attach JWT if present (localStorage)
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('jwtToken');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
}, (err) => Promise.reject(err));

/* -------------------------
   Auth
   ------------------------- */
export const register = (payload) => api.post('/auth/register', payload);
export const login    = (payload) => api.post('/auth/login', payload);
export const logout   = ()        => api.post('/auth/logout');
export const getCurrentUser = () => api.get('/auth/me');

/* -------------------------
   Items & Requests
   ------------------------- */
export const getItems  = () => api.get('/items');
export const getItem   = (id) => api.get(`/items/${id}`);
export const createItem = (formData) =>
  api.post('/items', formData, { headers: { 'Content-Type': 'multipart/form-data' } });

export const createRequest = (itemId, payload) => api.post(`/items/${itemId}/request`, payload);

/* -------------------------
   Map / Trust endpoints
   ------------------------- */
export const getMapItems = () => api.get('/map-items');
export const getTrustScore = (userId) => api.get(`/trust-score/${userId}`);

/* -------------------------
   Requests helpers
   ------------------------- */
export const getMyRequests = () => api.get('/requests/my');
export const cancelRequest = (requestId) => api.post(`/requests/${requestId}/cancel`);

export default api;
