// src/main.jsx
import React from "react";
import { createRoot } from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import { AuthProvider } from "./hooks/useAuth";
import "./index.css";
import "./App.css";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { SearchProvider } from "./context/SearchContext";
import "leaflet/dist/leaflet.css";
import "react-calendar/dist/Calendar.css";


const root = createRoot(document.getElementById("root"));

root.render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <SearchProvider>
          <App />
        </SearchProvider>
      </AuthProvider>
      <ToastContainer position="top-right" autoClose={3000} />
    </BrowserRouter>
  </React.StrictMode>
);
