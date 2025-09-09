// src/App.jsx
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Layout from './components/layout/Layout';
import AppRoutes from './routes/AppRoutes';

export default function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        {/* AppRoutes exports an array of Route elements */}
        <Route index element={<AppRoutes.Home />} />
        <Route path="items/:id" element={<AppRoutes.ItemDetails />} />
        <Route path="add-item" element={<AppRoutes.AddItem />} />
        <Route path="my-requests" element={<AppRoutes.MyRequests />} />
        <Route path="map" element={<AppRoutes.MapView />} />
        <Route path="profile" element={
          <AppRoutes.Protected>
            <AppRoutes.Profile />
          </AppRoutes.Protected>
        } />
        <Route path="login" element={<AppRoutes.Login />} />
        <Route path="signup" element={<AppRoutes.Signup />} />
        <Route path="about" element={<AppRoutes.About />} />
        <Route path="*" element={<AppRoutes.NotFound />} />
      </Route>
    </Routes>
  );
}
