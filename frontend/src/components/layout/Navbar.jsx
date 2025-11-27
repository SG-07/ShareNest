// src/components/layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, User, Bell, ChevronDown } from "lucide-react";
import Logo from "../../assets/logo.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardOpen, setDashboardOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/add-item", label: "Add Item" },
  ];

  const dashboardLinks = [
    { to: "/dashboard/my-items", label: "My Items" },
    { to: "/dashboard/borrowed-items", label: "Items I Borrowed" },
    { to: "/dashboard/requests/received", label: "Requests Received" },
    { to: "/dashboard/requests/sent", label: "Requests I Made" },
  ];

  // Close menus on click outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current &&
        !menuRef.current.contains(e.target) &&
        mobileMenuRef.current &&
        !mobileMenuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setMobileOpen(false);
        setDashboardOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  return (
    <header className="bg-white shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">

        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 font-bold text-xl text-indigo-600">ShareNest</span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Desktop Navbar */}
        <ul className="hidden md:flex space-x-6 items-center">

          {/* Static Links */}
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {/* Dashboard Dropdown */}
          {user && (
            <li className="relative">
              <button
                onClick={() => setDashboardOpen((p) => !p)}
                className="flex items-center text-gray-700 hover:text-indigo-600"
              >
                Dashboard <ChevronDown className="w-4 ml-1" />
              </button>

              {dashboardOpen && (
                <div className="absolute right-0 mt-2 w-56 bg-white border rounded-lg shadow-lg py-2 z-50">
                  {dashboardLinks.map((link) => (
                    <Link
                      key={link.to}
                      to={link.to}
                      onClick={() => setDashboardOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      {link.label}
                    </Link>
                  ))}
                </div>
              )}
            </li>
          )}

          {/* Notifications */}
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Account Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="ml-2 flex items-center focus:outline-none"
            >
              <User className="w-6 h-6 text-gray-600 mr-1" />
              <span className="text-gray-700">{user ? `Hi, ${user.name}` : "Account"}</span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                {!user ? (
                  <>
                    <Link to="/login" className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                    <Link to="/signup" className="block px-4 py-2 hover:bg-gray-100">Signup</Link>
                  </>
                ) : (
                  <>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-100">
                      Settings
                    </Link>
                    <button
                      onClick={() => logout()}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100"
                    >
                      Logout
                    </button>
                  </>
                )}
              </div>
            )}
          </div>
        </ul>

        {/* Mobile Toggle */}
        <button className="md:hidden ml-4" onClick={() => setMobileOpen((p) => !p)}>
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* MOBILE MENU */}
      {mobileOpen && (
        <div className="md:hidden bg-white border-t" ref={mobileMenuRef}>

          <div className="p-4">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
            />
          </div>

          <ul className="flex flex-col p-4 space-y-2">
            {navLinks.map((link) => (
              <li key={link.to}>
                <NavLink
                  to={link.to}
                  onClick={() => setMobileOpen(false)}
                  className={({ isActive }) =>
                    isActive ? "text-indigo-600 font-medium" : "text-gray-600 hover:text-indigo-600"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Dashboard (Mobile) */}
            {user && (
              <div className="space-y-1">
                <p className="px-4 pt-2 text-gray-500 font-semibold">Dashboard</p>
                {dashboardLinks.map((link) => (
                  <NavLink
                    key={link.to}
                    to={link.to}
                    onClick={() => setMobileOpen(false)}
                    className="block px-4 py-2 hover:bg-gray-100"
                  >
                    {link.label}
                  </NavLink>
                ))}
              </div>
            )}

            {/* Auth Buttons */}
            {!user ? (
              <>
                <Link to="/login" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Login</Link>
                <Link to="/signup" onClick={() => setMobileOpen(false)} className="block px-4 py-2 hover:bg-gray-100">Signup</Link>
              </>
            ) : (
              <>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </ul>
        </div>
      )}
    </header>
  );
}
