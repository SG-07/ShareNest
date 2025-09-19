// src/components/layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, User, Bell } from "lucide-react";
import Logo from "../../assets/logo.svg";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/add-item", label: "Add Item" },
  ];

  // Close menus when clicking outside
  useEffect(() => {
    function handleClickOutside(e) {
      if (
        menuRef.current && !menuRef.current.contains(e.target) &&
        mobileMenuRef.current && !mobileMenuRef.current.contains(e.target)
      ) {
        setMenuOpen(false);
        setMobileOpen(false);
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
          <span className="ml-2 font-bold text-xl text-indigo-600">
            ShareNest
          </span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-md border border-gray-300 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500"
          />
        </div>

        {/* Desktop Links */}
        <ul className="hidden md:flex space-x-6 items-center">
          {navLinks.map((link) => (
            <li key={link.to}>
              <NavLink
                to={link.to}
                className={({ isActive }) =>
                  isActive
                    ? "text-indigo-600 font-medium"
                    : "text-gray-600 hover:text-indigo-600"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {/* Notifications */}
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-gray-600" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="ml-2 flex items-center focus:outline-none"
            >
              <User className="w-6 h-6 text-gray-600 mr-1" />
              <span className="text-gray-700">
                {user ? `Hi, ${user.name}` : "Account"}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white border rounded-lg shadow-lg py-2 z-50">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/add-item"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Add Item
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
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

        {/* Mobile Menu Toggle */}
        <button
          className="md:hidden ml-4"
          onClick={() => setMobileOpen((p) => !p)}
        >
          {mobileOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </nav>

      {/* Mobile Menu */}
      {mobileOpen && (
        <div
          className="md:hidden bg-white border-t"
          ref={mobileMenuRef}
        >
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
                    isActive
                      ? "text-indigo-600 font-medium"
                      : "text-gray-600 hover:text-indigo-600"
                  }
                >
                  {link.label}
                </NavLink>
              </li>
            ))}

            {/* Mobile User Menu */}
            {!user ? (
              <>
                <Link
                  to="/login"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/add-item"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Add Item
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Settings
                </Link>
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
