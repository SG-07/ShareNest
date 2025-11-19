// src/App.jsx
import { Routes, Route } from "react-router-dom";
import Layout from "./components/layout/Layout";
import AppRoutes from "./routes/AppRoutes";

/**
 * Root App Component
 */
export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>

        {/* Home / Catalog */}
        <Route index element={<AppRoutes.Home />} />

        {/* Items */}
        <Route path="items/:id" element={<AppRoutes.ItemDetails />} />
        <Route path="add-item" element={<AppRoutes.AddItem />} />

        {/* Borrow Page */}
        <Route path="borrow/:itemId" element={<AppRoutes.BorrowItem />} />

        {/* Map */}
        <Route path="map" element={<AppRoutes.MapView />} />

        {/* Profile (protected) */}
        <Route
          path="profile"
          element={
            <AppRoutes.Protected>
              <AppRoutes.Profile />
            </AppRoutes.Protected>
          }
        />

        {/* Auth */}
        <Route path="login" element={<AppRoutes.Login />} />
        <Route path="signup" element={<AppRoutes.Signup />} />

        {/* About */}
        <Route path="about" element={<AppRoutes.About />} />

        {/* 404 */}
        <Route path="*" element={<AppRoutes.NotFound />} />
      </Route>
    </Routes>
  );
}
