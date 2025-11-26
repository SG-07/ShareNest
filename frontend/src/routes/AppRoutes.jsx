// src/routes/AppRoutes.jsx

// pages
import Home from "../pages/Home";
import ItemDetails from "../pages/ItemDetails";
import AddItem from "../pages/AddItem/AddItem";
import NotFound from "../pages/NotFound";
import Login from "../pages/Login";
import Signup from "../pages/Signup";
import BorrowItem from "../pages/BorrowItem/BorrowItem";
import ProtectedRoute from "./ProtectedRoute";
import UpdateItem from "../pages/UpdateItem/UpdateItem";
import ReceivedRequests from "../pages/Requests/ReceivedRequests";
import RequestsByItem from "../pages/Requests/RequestsByItem";

// lazy placeholders for pages you can implement next
const MyRequests = () => (
  <div className="max-w-7xl mx-auto p-6">My Requests (coming soon)</div>
);
const MapView = () => (
  <div className="max-w-7xl mx-auto p-6">Map View (coming soon)</div>
);
const Profile = () => (
  <div className="max-w-7xl mx-auto p-6">Profile (coming soon)</div>
);
const About = () => (
  <div className="max-w-7xl mx-auto p-6">About ShareNest</div>
);


export default {
  // helper wrapper component for protected routes
  Protected: ({ children }) => <ProtectedRoute>{children}</ProtectedRoute>,
  Home,
  ItemDetails,
  AddItem,
  MyRequests,
  MapView,
  Profile,
  Login,
  Signup,
  NotFound,
  BorrowItem,
  About,
  UpdateItem,
  ReceivedRequests,
  RequestsByItem,
  
};
