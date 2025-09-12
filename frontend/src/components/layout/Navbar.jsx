// src/components/layout/Navbar.jsx
import { Link, NavLink } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import { useAuth } from "../../hooks/useAuth";
import { Menu, X, User, Bell, Sun, Moon } from "lucide-react";
import Logo from "../../assets/logo.svg";
import api from "../../services/api";
import { devLog } from "../../utils/devLog";

export default function Navbar() {
  const { user, logout } = useAuth();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(false);
  const menuRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/about", label: "About" },
    { to: "/dashboard", label: "Dashboard" },
    { to: "/add-item", label: "Add Item" },
  ];

  // fetch user preferences (dark mode) whenever user changes
  useEffect(() => {
    if (!user) return;
    (async () => {
      try {
        devLog("Fetching user preferences...");
        const res = await api.get("/user/preferences");
        setDarkMode(res.data?.darkMode ?? false);
      } catch (err) {
        console.error("Failed to load user preferences", err);
      }
    })();
  }, [user]);

  // apply dark mode class & save preference
  useEffect(() => {
    if (darkMode) document.documentElement.classList.add("dark");
    else document.documentElement.classList.remove("dark");

    if (user) api.post("/user/preferences", { darkMode }).catch(console.error);
  }, [darkMode, user]);

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
    <header className="bg-white dark:bg-gray-900 shadow sticky top-0 z-50">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center h-16">
        {/* Logo */}
        <Link to="/" className="flex items-center">
          <img src={Logo} alt="Logo" className="h-8 w-auto" />
          <span className="ml-2 font-bold text-xl text-indigo-600 dark:text-indigo-400">
            ShareNest
          </span>
        </Link>

        {/* Search bar */}
        <div className="hidden md:flex flex-1 mx-6">
          <input
            type="text"
            placeholder="Search items..."
            className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
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
                    ? "text-indigo-600 dark:text-indigo-400 font-medium"
                    : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
                }
              >
                {link.label}
              </NavLink>
            </li>
          ))}

          {/* Notifications */}
          <button className="relative p-2">
            <Bell className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            <span className="absolute top-1 right-1 h-2 w-2 bg-red-500 rounded-full"></span>
          </button>

          {/* Dark mode toggle */}
          <button
            onClick={() => setDarkMode((prev) => !prev)}
            className="p-2 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800"
          >
            {darkMode ? (
              <Sun className="w-6 h-6 text-yellow-400" />
            ) : (
              <Moon className="w-6 h-6 text-gray-600 dark:text-gray-300" />
            )}
          </button>

          {/* User Menu */}
          <div className="relative" ref={menuRef}>
            <button
              onClick={() => setMenuOpen((p) => !p)}
              className="ml-2 flex items-center focus:outline-none"
            >
              <User className="w-6 h-6 text-gray-600 dark:text-gray-300 mr-1" />
              <span className="text-gray-700 dark:text-gray-200">
                {user ? `Hi, ${user.name}` : "Account"}
              </span>
            </button>

            {menuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 border dark:border-gray-700 rounded-lg shadow-lg py-2 z-50">
                {!user ? (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Login
                    </Link>
                    <Link
                      to="/signup"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Signup
                    </Link>
                  </>
                ) : (
                  <>
                    <Link
                      to="/add-item"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Add Item
                    </Link>
                    <Link
                      to="/settings"
                      onClick={() => setMenuOpen(false)}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      Settings
                    </Link>
                    <button
                      onClick={() => {
                        logout();
                        setMenuOpen(false);
                      }}
                      className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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
          className="md:hidden bg-white dark:bg-gray-900 border-t dark:border-gray-700"
          ref={mobileMenuRef}
        >
          <div className="p-4">
            <input
              type="text"
              placeholder="Search items..."
              className="w-full rounded-md border border-gray-300 dark:border-gray-700 px-3 py-1 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 dark:bg-gray-800 dark:text-white"
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
                      ? "text-indigo-600 dark:text-indigo-400 font-medium"
                      : "text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400"
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
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Login
                </Link>
                <Link
                  to="/signup"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Signup
                </Link>
              </>
            ) : (
              <>
                <Link
                  to="/add-item"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Add Item
                </Link>
                <Link
                  to="/settings"
                  onClick={() => setMobileOpen(false)}
                  className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  Settings
                </Link>
                <button
                  onClick={() => {
                    logout();
                    setMobileOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
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
