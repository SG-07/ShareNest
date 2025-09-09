// src/routes/AppRoutes.jsx
import React from 'react';
import { Navigate } from 'react-router-dom';

// pages
import Home from '../pages/Home';
import ItemDetails from '../pages/ItemDetails';
import AddItem from '../pages/AddItem';
import NotFound from '../pages/NotFound';
import Login from '../pages/Login';
import Signup from '../pages/Signup';

// lazy placeholders for pages you can implement next
const MyRequests = () => <div className="max-w-7xl mx-auto p-6">My Requests (coming soon)</div>;
const MapView = () => <div className="max-w-7xl mx-auto p-6">Map View (coming soon)</div>;
const Profile = () => <div className="max-w-7xl mx-auto p-6">Profile (coming soon)</div>;
const About = () => <div className="max-w-7xl mx-auto p-6">About ShareNest</div>;

// Protected wrapper (imported below if needed)
import ProtectedRoute from './ProtectedRoute';

export default {
  Home,
  ItemDetails,
  AddItem,
  MyRequests,
  MapView,
  Profile,
  Login,
  Signup,
  NotFound,
  About,
  // helper wrapper component for protected routes
  Protected: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
};